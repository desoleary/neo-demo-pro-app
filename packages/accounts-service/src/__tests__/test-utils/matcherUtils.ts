export { default as colours } from './colours';

export function formatValue(value: unknown): string {
  if (Array.isArray(value)) return '[]';
  if (value !== null && typeof value === 'object') return '{ ... }';
  if (typeof value === 'string') return `"${value}"`;
  return String(value);
}