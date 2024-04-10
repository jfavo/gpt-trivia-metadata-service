/**
 * Casts a string that can possibly be undefined into a number
 * @param s String/Undefined variable to be casted
 * @param def Default number value
 * @returns Casted string or default value
 */
export function CastStringUndefinedToNumber(
  s: string | undefined,
  def: number,
): number {
  if (s) {
    try {
      const n = s as unknown as number;
      return n;
    } catch {}
  }

  return def;
}

/**
 * Converts a string to title case
 * Ex. tesTing! => Testing!
 * @param str The string to convert to title case
 * @returns a title cased string
 */
export function toTitleCase(str: string): string {
  return str?.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();
}
