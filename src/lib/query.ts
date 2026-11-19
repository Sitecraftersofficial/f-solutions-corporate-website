import useSWR, { useSWRConfig, type Cache } from "swr";

export type CachedQuery<T> = {
  key: string;
  queryFn: (signal: AbortSignal) => Promise<T>;
  staleTime?: number;
};

const activeRequests = new Set<AbortController>();
let cacheGeneration = 0;

export function createCachedFetcher<T>(query: CachedQuery<T>) {
  return async () => {
    const requestGeneration = cacheGeneration;
    const controller = new AbortController();
    activeRequests.add(controller);
    try {
      const data = await query.queryFn(controller.signal);
      if (controller.signal.aborted || requestGeneration !== cacheGeneration) {
        throw new DOMException(
          "Request was cancelled after the data cache was cleared.",
          "AbortError",
        );
      }
      return data;
    } finally {
      activeRequests.delete(controller);
    }
  };
}

export function useCachedData<T>(query: CachedQuery<T>) {
  const result = useSWR(query.key, createCachedFetcher(query), {
    dedupingInterval: query.staleTime,
  });
  return {
    ...result,
    isPending: result.isLoading,
  };
}

export function useDataCache() {
  const { cache, mutate } = useSWRConfig();
  return {
    invalidate: () => {
      for (const key of cache.keys()) void mutate(key);
    },
    clear: () =>
      clearCachedData(cache, (key) => {
        void mutate(key, undefined, { revalidate: false });
      }),
  };
}

export function clearCachedData(cache: Cache<unknown>, notify?: (key: string) => void) {
  cacheGeneration += 1;
  for (const controller of activeRequests) controller.abort();
  activeRequests.clear();
  for (const key of cache.keys()) {
    notify?.(key);
    cache.delete(key);
  }
}
