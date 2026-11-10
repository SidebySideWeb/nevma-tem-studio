import { sharedObjects } from './objects/shared';
import { collections } from './documents/collections';
import { forms } from './documents/forms';
import { singletons } from './singletons/pages';

export { SINGLETONS } from './singletons/pages';
export const schemaTypes = [...sharedObjects, ...singletons, ...collections, ...forms];
