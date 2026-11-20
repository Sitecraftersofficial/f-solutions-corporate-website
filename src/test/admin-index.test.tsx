import { describe, expect, it } from "vitest";
import { matchRoutes } from "react-router-dom";
import { appRoutes } from "@/app-routes";

describe("Administrator refresh destinations", () => {
  it("opens the dashboard index at /admin", () => {
    expect(matchRoutes(appRoutes, "/admin")?.at(-1)?.route.index).toBe(true);
  });
  it.each(["products", "categories", "animals", "partners", "documents", "enquiries", "content", "media", "activity", "settings"])("keeps /admin/%s on its own protected page", (page) => {
    const matches = matchRoutes(appRoutes, `/admin/${page}`);
    expect(matches?.at(-1)?.route.path).toBe(page);
    expect(matches?.some((r) => r.route.path === "admin")).toBe(true);
  });
});