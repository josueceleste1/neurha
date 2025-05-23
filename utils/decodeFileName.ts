export function decodeFileName(name: string): string {
  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
}
  