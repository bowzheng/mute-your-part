import assert from 'node:assert/strict';
import { test } from 'node:test';
import '../extension/src/shared/parts.js';

const { STEMS, ROLES, findRole, stemGains } = globalThis.MuteYourPartParts;

test('every role mutes one known stem', () => {
  assert.equal(ROLES.length, 5);
  for (const role of ROLES) {
    assert.ok(STEMS.includes(role.mutes), role.id);
  }
});

test('stemGains silences only the selected part', () => {
  assert.deepEqual(stemGains('bassist'), {
    drums: 1,
    bass: 0,
    other: 1,
    vocals: 1,
    guitar: 1,
    piano: 1,
  });
});

test('stemGains leaves every part on without a valid role', () => {
  for (const roleId of [null, undefined, 'unknown']) {
    assert.ok(Object.values(stemGains(roleId)).every((gain) => gain === 1));
  }
});

test('findRole returns null for unknown roles', () => {
  assert.equal(findRole('unknown'), null);
});
