/**
 * Ritta allows schools to choose features they want to use.
 * Feature IDs are defined here. Even if you develope private features, you should register them here to avoid overrlapping with other features.
 */
export enum Feature {
  MESSAGE_THREADS = 0,
  ANNOUNCEMENTS = 1
}

/**
 * These are instance wide features. The feature IDs can overlap with normal feature IDs.
 */
export enum InstanceFeature {
  ANNOUNCEMENTS = 0,
}

