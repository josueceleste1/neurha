export function decodeFileName(name: string): string {
    try {
      return decodeURIComponent(escape(name));
    } catch {
      return name;
    }
  }
  