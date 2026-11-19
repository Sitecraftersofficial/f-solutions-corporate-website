import { describe, expect, it } from "vitest";
import type { Cache } from "swr";
import { clearCachedData, createCachedFetcher } from "./query";

describe("cached data cancellation", () => {
  it("aborts pending requests and discards their results when the cache is cleared", async () => {
    let resolveRequest!: (value: string) => void;
    let requestSignal: AbortSignal | undefined;
    const fetch = createCachedFetcher({
      key: "admin:records",
      queryFn: (signal) => {
        requestSignal = signal;
        return new Promise<string>((resolve) => {
          resolveRequest = resolve;
        });
      },
    });

    const pending = fetch();
    clearCachedData(new Map() as Cache<unknown>);
    expect(requestSignal?.aborted).toBe(true);

    resolveRequest("stale private data");
    await expect(pending).rejects.toMatchObject({ name: "AbortError" });
  });
});
