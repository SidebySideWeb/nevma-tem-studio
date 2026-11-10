import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  isHoneypotFilled,
  normalizeProjectTypes,
  validateEnquiry,
} from '../../src/lib/server/validate';

const allowed = ['Recording', 'Mixing', 'Other'];

const base = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  projectTypes: ['Recording'],
  consent: true,
};

describe('validateEnquiry', () => {
  it('accepts a minimal valid enquiry', () => {
    const r = validateEnquiry(base, allowed);
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.equal(r.data.name, 'Ada Lovelace');
      assert.deepEqual(r.data.projectTypes, ['Recording']);
      assert.equal(r.data.consent, true);
    }
  });

  it('rejects short names and bad emails', () => {
    const r = validateEnquiry({ ...base, name: 'A', email: 'nope' }, allowed);
    assert.equal(r.ok, false);
    if (!r.ok) {
      assert.ok(r.fields.name);
      assert.ok(r.fields.email);
    }
  });

  it('requires at least one allowed project type', () => {
    const r = validateEnquiry({ ...base, projectTypes: [] }, allowed);
    assert.equal(r.ok, false);
    const r2 = validateEnquiry({ ...base, projectTypes: ['Nope'] }, allowed);
    assert.equal(r2.ok, false);
  });

  it('rejects past preferredStart and out-of-range days', () => {
    const r = validateEnquiry({ ...base, preferredStart: '2000-01-01', days: '99' }, allowed);
    assert.equal(r.ok, false);
    if (!r.ok) {
      assert.ok(r.fields.preferredStart);
      assert.ok(r.fields.days);
    }
  });

  it('requires consent', () => {
    const r = validateEnquiry({ ...base, consent: false }, allowed);
    assert.equal(r.ok, false);
  });

  it('normalizes projectTypes from a single string', () => {
    assert.deepEqual(normalizeProjectTypes('Mixing'), ['Mixing']);
  });
});

describe('isHoneypotFilled', () => {
  it('detects a filled company field', () => {
    assert.equal(isHoneypotFilled({ company: 'bot' }), true);
    assert.equal(isHoneypotFilled({ company: '' }), false);
    assert.equal(isHoneypotFilled({ company: '  ' }), false);
  });
});
