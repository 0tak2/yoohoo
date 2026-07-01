import { describe, expect, it } from "vitest";
import { getApiBaseUrl } from "./api-base-url";

describe("getApiBaseUrl", () => {
  it("defaults to the Next rewrite route", () => {
    expect(getApiBaseUrl({})).toBe("/api");
  });

  it("uses NEXT_PUBLIC_API_BASE_URL when provided", () => {
    expect(
      getApiBaseUrl({ NEXT_PUBLIC_API_BASE_URL: "https://api.example.com" })
    ).toBe("https://api.example.com");
  });
});

