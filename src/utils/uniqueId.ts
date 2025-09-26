export function uniqueId(prefix = ''): string {
  const randomPart = Math.floor(Math.random() * 1_000_000);
  return `${prefix}${Date.now()}${randomPart}`;
}
