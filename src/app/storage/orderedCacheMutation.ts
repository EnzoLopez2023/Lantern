export const commitMutationBeforeCache = <Result>(
  enqueue: () => Result,
  mutateCache: () => void,
  onCacheFailure: (error: unknown, enqueueResult: Result) => void,
): Result => {
  const enqueueResult = enqueue();
  try {
    mutateCache();
  } catch (error) {
    onCacheFailure(error, enqueueResult);
    throw error;
  }
  return enqueueResult;
};

export const durableQueueFailureMessage = (error: unknown): string => {
  const detail = error instanceof Error ? ` ${error.message}` : '';
  return `The change could not be durably queued, so browser cache was not changed.${detail}`;
};
