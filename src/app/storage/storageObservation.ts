export interface StorageObservation {
  value: string | null;
  revision: number;
}

export const storageObservationMatches = (
  current: StorageObservation,
  observed: StorageObservation,
): boolean => current.value === observed.value
  && current.revision === observed.revision;

export interface ObservedWriteDecision {
  canWriteCache: boolean;
  baseRevision: number;
}

export const resolveObservedWrite = (
  current: StorageObservation,
  observed: StorageObservation,
): ObservedWriteDecision => current.value === observed.value
  ? { canWriteCache: true, baseRevision: current.revision }
  : { canWriteCache: false, baseRevision: observed.revision };
