/**
 * Sanity read client — build/server only. Never import from client `<script>` tags.
 */
import { createClient } from '@sanity/client';
import { roomsQuery, settingsQuery } from './queries';
import type { RoomCard, Settings } from './types';

export const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-10-01',
  useCdn: false,
  token: import.meta.env.SANITY_VIEWER_TOKEN,
  perspective: 'published',
});

let settingsMemo: Promise<Settings> | undefined;
let roomsMemo: Promise<RoomCard[]> | undefined;

/** Site settings — fetched once per build. */
export function getSettings(): Promise<Settings> {
  return (settingsMemo ??= client.fetch<Settings>(settingsQuery));
}

/** All rooms in order — fetched once per build (routes, nav, Other rooms). */
export function getRooms(): Promise<RoomCard[]> {
  return (roomsMemo ??= client.fetch<RoomCard[]>(roomsQuery));
}
