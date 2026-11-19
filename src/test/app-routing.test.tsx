import { describe, expect, it } from "vitest";
import { matchRoutes } from "react-router-dom";
import { appRoutes } from "@/app-routes";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches the home page at /", () => {
    const matches = matchRoutes(appRoutes, "/");
    expect(matches?.at(-1)?.route.index).toBe(true);
  });

  it("matches admin pages inside the protected route", () => {
    const matches = matchRoutes(appRoutes, "/admin/products");
    expect(matches?.some((match) => match.route.path === "admin")).toBe(true);
  });
});
