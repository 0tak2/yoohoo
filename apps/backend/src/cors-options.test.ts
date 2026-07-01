import { describe, expect, it } from "vitest";
import { buildCorsOptions } from "./cors-options.js";

describe("buildCorsOptions", () => {
  it("allows origins configured through a comma-separated env value", () => {
    const options = buildCorsOptions({
      FRONTEND_ORIGINS: "https://example.com, http://localhost:3001"
    });

    expect(isAllowed(options, "https://example.com")).toBe(true);
    expect(isAllowed(options, "http://localhost:3001")).toBe(true);
  });

  it("allows ngrok subdomains by default", () => {
    const options = buildCorsOptions({});

    expect(isAllowed(options, "https://yoohoo-demo.ngrok-free.app")).toBe(true);
    expect(isAllowed(options, "https://yoohoo-demo.ngrok.app")).toBe(true);
  });
});

function isAllowed(
  options: ReturnType<typeof buildCorsOptions>,
  origin: string
) {
  let result = false;
  options.origin(origin, (error, allowed) => {
    if (error) {
      throw error;
    }
    result = allowed === true;
  });
  return result;
}

