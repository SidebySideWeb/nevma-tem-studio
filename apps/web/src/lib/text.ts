/** Split a displayHeading into lines (one line per row → `<br>`). */
export function lines(text: string | null | undefined): string[] {
  if (!text) return [];
  return text.split('\n');
}
