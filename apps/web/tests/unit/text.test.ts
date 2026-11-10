import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { lines } from '../../src/lib/text';

describe('lines', () => {
  it('splits a displayHeading on newlines', () => {
    assert.deepEqual(lines('Make yours\nhere.'), ['Make yours', 'here.']);
  });

  it('returns an empty array for empty input', () => {
    assert.deepEqual(lines(''), []);
    assert.deepEqual(lines(null), []);
    assert.deepEqual(lines(undefined), []);
  });

  it('keeps a single line', () => {
    assert.deepEqual(lines('About'), ['About']);
  });
});
