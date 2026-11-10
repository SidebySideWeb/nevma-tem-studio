import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { href } from '../../src/lib/links';

const rooms = [
  { slug: 'studio-a', order: 1 },
  { slug: 'live-room', order: 2 },
  { slug: 'lounge', order: 3 },
];

describe('href', () => {
  it('maps internal pages', () => {
    assert.equal(href({ page: 'home' }, rooms), '/');
    assert.equal(href({ page: 'about' }, rooms), '/about');
    assert.equal(href({ page: 'enquire' }, rooms), '/enquire');
    assert.equal(href({ page: 'contact' }, rooms), '/contact');
  });

  it('maps studio to the lowest-order room', () => {
    assert.equal(href({ page: 'studio' }, rooms), '/studio/studio-a');
  });

  it('maps a room reference by slug', () => {
    assert.equal(href({ room: { slug: 'live-room' } }, rooms), '/studio/live-room');
  });

  it('returns external urls as-is', () => {
    assert.equal(href({ url: 'https://example.com' }, rooms), 'https://example.com');
  });

  it('prefers url over page', () => {
    assert.equal(href({ page: 'about', url: 'https://x.test' }, rooms), 'https://x.test');
  });
});
