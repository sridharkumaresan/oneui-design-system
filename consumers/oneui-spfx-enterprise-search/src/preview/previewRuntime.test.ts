import { getRuntimeModeForVisibleDataMode, getVisibleDataModeFromSearch, visibleDataModes } from "./previewRuntime";

describe("previewRuntime", () => {
  it("exposes only dummy and real as visible data modes", () => {
    expect(visibleDataModes).toEqual(["dummy", "real"]);
  });

  it("maps visible dummy mode to internal dummy runtime", () => {
    expect(getRuntimeModeForVisibleDataMode("dummy")).toBe("dummy");
  });

  it("maps visible real mode to internal real runtime", () => {
    expect(getRuntimeModeForVisibleDataMode("real")).toBe("real");
  });

  it("falls back to dummy mode when the search parameter is invalid", () => {
    expect(getVisibleDataModeFromSearch("?mode=hybrid")).toBe("dummy");
    expect(getVisibleDataModeFromSearch("?mode=unexpected")).toBe("dummy");
  });
});
