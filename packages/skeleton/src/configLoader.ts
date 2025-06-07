export function loadConfig<T extends Record<string, any>>(defaults: T): T {
  return Object.fromEntries(
    Object.entries(defaults).map(([key, value]) => [
      key,
      process.env[key] ?? value,
    ]),
  ) as T;
}
