import type { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface.js";

type EnvLike = {
  FRONTEND_ORIGINS?: string;
  FRONTEND_ORIGIN?: string;
};

const defaultAllowedOrigins = [
  "http://localhost:3001",
  "http://127.0.0.1:3001"
];

const defaultAllowedOriginPatterns = [
  /^https:\/\/[a-z0-9-]+\.ngrok-free\.app$/,
  /^https:\/\/[a-z0-9-]+\.ngrok\.app$/
];

export function buildCorsOptions(env: EnvLike = process.env): CorsOptions {
  const explicitOrigins = parseOrigins(env.FRONTEND_ORIGINS ?? env.FRONTEND_ORIGIN);
  const allowedOrigins =
    explicitOrigins.length > 0 ? explicitOrigins : defaultAllowedOrigins;

  return {
    credentials: true,
    origin(origin, callback) {
      if (!origin || isAllowedOrigin(origin, allowedOrigins)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    }
  };
}

function parseOrigins(value: string | undefined) {
  return (
    value
      ?.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean) ?? []
  );
}

function isAllowedOrigin(origin: string, allowedOrigins: string[]) {
  return (
    allowedOrigins.includes(origin) ||
    defaultAllowedOriginPatterns.some((pattern) => pattern.test(origin))
  );
}
