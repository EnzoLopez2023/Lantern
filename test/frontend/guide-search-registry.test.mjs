import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  GUIDE_SEARCH_IDS,
  assertGuideRegistryConsistency,
} from '../../src/KnowledgeBase/guideSearchRegistry.ts';

test('all 51 registered Knowledge Base guides are searchable', async () => {
  const source = await readFile('src/KnowledgeBase/index.tsx', 'utf8');
  const registrySource = source.slice(
    source.indexOf('const GUIDES: GuideMeta[] = ['),
    source.indexOf('assertGuideRegistryConsistency('),
  );
  const registeredIds = [...registrySource.matchAll(/\bid:\s*'([^']+)'/g)]
    .map(match => match[1]);

  assert.equal(registeredIds.length, 51);
  assert.equal(new Set(GUIDE_SEARCH_IDS).size, 51);
  assert.doesNotThrow(() => assertGuideRegistryConsistency(registeredIds));
  for (const id of [
    'xcode-beginners',
    'swiftui-fundamentals',
    'first-app-tip',
    'first-app-todo',
    'photo-handling',
    'phaser-game',
  ]) {
    assert.ok(GUIDE_SEARCH_IDS.includes(id));
  }
});
