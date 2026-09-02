#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DEFAULT_KILL_GRACE_MS = 1_000;

function killProcessGroup(child, signal) {
  if (!child.pid) return;
  try {
    if (process.platform === 'win32') child.kill(signal);
    else process.kill(-child.pid, signal);
  } catch (error) {
    if (error?.code !== 'ESRCH') throw error;
  }
}

export async function runWithTimeoutOutcome({
  command,
  args = [],
  timeoutMs,
  killGraceMs = DEFAULT_KILL_GRACE_MS,
  env = process.env,
}) {
  if (!command) throw new Error('checker command is required');
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1) {
    throw new Error('timeoutMs must be a positive integer');
  }

  const child = spawn(command, args, {
    detached: process.platform !== 'win32',
    env,
    shell: false,
    stdio: 'inherit',
  });

  let timedOut = false;
  let terminationRequested = false;
  let terminationSignal = null;
  let forceKillTimer;
  let forceKillComplete;
  const terminate = signal => {
    terminationRequested = true;
    terminationSignal ??= signal;
    killProcessGroup(child, signal);
    if (!forceKillComplete) {
      forceKillComplete = new Promise(resolveKill => {
        forceKillTimer = setTimeout(() => {
          killProcessGroup(child, 'SIGKILL');
          resolveKill();
        }, killGraceMs);
      });
    }
  };
  const timeout = setTimeout(() => {
    timedOut = true;
    terminate('SIGTERM');
  }, timeoutMs);

  const signalHandlers = new Map([
    ['SIGINT', () => terminate('SIGINT')],
    ['SIGTERM', () => terminate('SIGTERM')],
  ]);
  for (const [signal, handler] of signalHandlers) process.once(signal, handler);

  const outcome = await new Promise(resolveOutcome => {
    let settled = false;
    const settle = value => {
      if (settled) return;
      settled = true;
      resolveOutcome(value);
    };
    child.once('error', error => settle({ error, code: null, signal: null }));
    child.once('close', (code, signal) => settle({ error: null, code, signal }));
  });

  clearTimeout(timeout);
  if (terminationRequested && forceKillComplete) await forceKillComplete;
  else clearTimeout(forceKillTimer);
  for (const [signal, handler] of signalHandlers) process.removeListener(signal, handler);

  if (timedOut) return { exitCode: 124, recordValue: '124' };
  if (outcome.error) {
    process.stderr.write(`checker could not be started: ${outcome.error.message}\n`);
    return {
      exitCode: 127,
      recordValue: `spawn-error:${outcome.error.code ?? 'unknown'}`,
    };
  }
  if (outcome.signal) {
    process.stderr.write(`checker terminated by signal ${outcome.signal}\n`);
    return { exitCode: 1, recordValue: `signal:${outcome.signal}` };
  }
  if (terminationRequested) {
    return { exitCode: 1, recordValue: `signal:${terminationSignal ?? 'unknown'}` };
  }
  const exitCode = outcome.code ?? 1;
  return { exitCode, recordValue: String(exitCode) };
}

export async function runWithTimeout(options) {
  return (await runWithTimeoutOutcome(options)).exitCode;
}

function parseArgs(argv) {
  const separator = argv.indexOf('--');
  if (separator === -1 || separator === argv.length - 1) {
    throw new Error('usage: deployment-check-runner.mjs --timeout-ms N -- command [args...]');
  }
  const options = argv.slice(0, separator);
  const command = argv[separator + 1];
  const args = argv.slice(separator + 2);
  const timeoutIndex = options.indexOf('--timeout-ms');
  if (timeoutIndex === -1 || timeoutIndex === options.length - 1) {
    throw new Error('--timeout-ms is required');
  }
  const timeoutMs = Number(options[timeoutIndex + 1]);
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1) {
    throw new Error('--timeout-ms must be a positive integer');
  }
  return { command, args, timeoutMs };
}

export async function main(argv) {
  try {
    return await runWithTimeoutOutcome(parseArgs(argv));
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    return { exitCode: 2, recordValue: `wrapper-error:${error.message}` };
  }
}

const invokedDirectly = process.argv[1] && import.meta.url === `file://${resolve(process.argv[1])}`;
if (invokedDirectly) {
  const outcome = await main(process.argv.slice(2));
  if (process.env.GITHUB_OUTPUT) {
    try {
      const recordValue = String(outcome.recordValue).replace(/[\r\n]/g, ' ');
      appendFileSync(process.env.GITHUB_OUTPUT, `exit_code=${recordValue}\n`);
    } catch (error) {
      process.stderr.write(`could not publish checker exit code: ${error.message}\n`);
    }
  }
  process.exit(outcome.exitCode);
}
