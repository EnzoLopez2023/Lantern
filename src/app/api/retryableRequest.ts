export const retryableRequest = <T>(
  requests: Map<string, Promise<T>>,
  key: string,
  factory: () => Promise<T>,
  force = false,
): Promise<T> => {
  if (force) requests.delete(key);
  const existing = requests.get(key);
  if (existing) return existing;
  const request = factory();
  requests.set(key, request);
  void request.catch(() => {
    if (requests.get(key) === request) requests.delete(key);
  });
  return request;
};
