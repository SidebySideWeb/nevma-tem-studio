import type { Client, ClientGroup } from './types';

function sortKey(c: Client): string {
  return (c.sortName || c.name || '').trim();
}

function letterOf(c: Client): string {
  const ch = sortKey(c).charAt(0).toUpperCase();
  return ch >= 'A' && ch <= 'Z' ? ch : '#';
}

/**
 * Group clients A–Z for the Clients wall.
 * Letter from coalesce(sortName, name); non A–Z → "#"; partners first within a letter; "#" last.
 */
export function groupClients(clients: Client[]): ClientGroup[] {
  const map = new Map<string, Client[]>();
  for (const c of clients) {
    const letter = letterOf(c);
    const list = map.get(letter);
    if (list) list.push(c);
    else map.set(letter, [c]);
  }

  const letters = [...map.keys()].sort((a, b) => {
    if (a === '#') return 1;
    if (b === '#') return -1;
    return a.localeCompare(b);
  });

  return letters.map((letter) => ({
    letter,
    clients: [...(map.get(letter) ?? [])].sort((a, b) => {
      const ap = a.partner ? 0 : 1;
      const bp = b.partner ? 0 : 1;
      if (ap !== bp) return ap - bp;
      return sortKey(a).localeCompare(sortKey(b), 'en', { sensitivity: 'base' });
    }),
  }));
}
