export const retryableRequest = <T>(
  requests: Map<string, Promise<T>>,
  key: string,
  factory: () => Promise<T>,
): Promise<T> => {
  const existing = requests.get(key);
  if (existing) return existing;
  const request = factory();
  requests.set(key, request);
  const clear = () => {
    if (requests.get(key) === request) requests.delete(key);
  };
  void request.then(clear, clear);
  return request;
};
