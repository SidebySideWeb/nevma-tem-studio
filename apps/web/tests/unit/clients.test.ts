import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { groupClients } from '../../src/lib/clients';
import type { Client } from '../../src/lib/types';

const c = (partial: Partial<Client> & { name: string; _id: string }): Client => ({
  partner: false,
  ...partial,
});

describe('groupClients', () => {
  it('groups by first letter of coalesce(sortName, name)', () => {
    const groups = groupClients([
      c({ _id: '1', name: 'Zebra' }),
      c({ _id: '2', name: 'The Beatles', sortName: 'Beatles, The' }),
      c({ _id: '3', name: 'Alpha' }),
    ]);
    assert.deepEqual(
      groups.map((g) => g.letter),
      ['A', 'B', 'Z'],
    );
    assert.equal(groups[1].clients[0].name, 'The Beatles');
  });

  it('lists partners first within a letter, then alphabetically', () => {
    const groups = groupClients([
      c({ _id: '1', name: 'Anchor' }),
      c({ _id: '2', name: 'Alpha Act', partner: true }),
      c({ _id: '3', name: 'Azure', partner: true }),
      c({ _id: '4', name: 'Aster' }),
    ]);
    assert.equal(groups.length, 1);
    assert.deepEqual(
      groups[0].clients.map((x) => x.name),
      ['Alpha Act', 'Azure', 'Anchor', 'Aster'],
    );
  });

  it('puts non A–Z under # after Z', () => {
    const groups = groupClients([
      c({ _id: '1', name: '123 Records' }),
      c({ _id: '2', name: 'Zoo' }),
      c({ _id: '3', name: 'Álvaro' }),
    ]);
    assert.deepEqual(
      groups.map((g) => g.letter),
      ['Z', '#'],
    );
    assert.equal(groups.at(-1)?.letter, '#');
    assert.equal(groups.at(-1)?.clients.length, 2);
  });
});
