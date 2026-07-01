type EnvLike = {
  [key: string]: string | undefined;
  NEXT_PUBLIC_API_BASE_URL?: string;
};

export function getApiBaseUrl(env: EnvLike = process.env) {
  return env.NEXT_PUBLIC_API_BASE_URL ?? "/api";
}
