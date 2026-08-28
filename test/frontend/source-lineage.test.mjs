import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const digest = value => createHash('sha256').update(value).digest('hex');

test('source lineage covers every pinned destination at its recorded hash', async () => {
  const manifest = JSON.parse(await readFile('docs/source-lineage.json', 'utf8'));
  assert.equal(manifest.contract, 'lantern.source-lineage.v1');
  assert.equal(manifest.source.commit, 'f0b05fc1dbf53e8aa26c215d8e858894a2793871');
  assert.equal(manifest.summary.sourceFiles, 225);
  assert.equal(manifest.summary.lanternSupport, 7);
  assert.equal(
    manifest.summary.exactCopies + manifest.summary.adapted + manifest.summary.lanternSupport,
    manifest.summary.files,
  );

  for (const entry of manifest.files) {
    const contents = await readFile(entry.destinationPath);
    assert.equal(digest(contents), entry.destinationSha256, entry.destinationPath);
  }
});
