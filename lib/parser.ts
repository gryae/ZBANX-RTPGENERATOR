import type { Hotel } from "@/types/hotel";

/**
 * Remove trailing _<number> from hotel name to get a clean location tag.
 * Examples:
 *   "Ayres Suites Diamond Bar_1"  → "Ayres Suites Diamond Bar"
 *   "Hotel XYZ_15"               → "Hotel XYZ"
 */
export function stripTrailingNumber(name: string): string {
  return name.replace(/_\d+$/, "").trim();
}

/**
 * Parse hotel list from clipboard HTML (Feishu rich text with embedded <a> tags).
 * Each <a> element becomes one hotel entry with its href preserved.
 */
export function parseHotelListHTML(html: string): Hotel[] {
  if (typeof window === "undefined") return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const anchors = doc.querySelectorAll("a");

  if (anchors.length === 0) return [];

  const hotels: Hotel[] = [];

  anchors.forEach((anchor) => {
    const hotelName = anchor.textContent?.trim() ?? "";
    const videoLink = anchor.getAttribute("href") ?? "";

    if (!hotelName) return;

    hotels.push({
      hotelName,
      videoLink,
      locationTag: stripTrailingNumber(hotelName),
    });
  });

  return hotels;
}

/**
 * Fallback parser for plain-text hotel list (one hotel per line).
 */
export function parseHotelListText(text: string): Hotel[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((hotelName) => ({
      hotelName,
      videoLink: "",
      locationTag: stripTrailingNumber(hotelName),
    }));
}

/**
 * Auto-detect whether clipboard data is HTML (with anchors) or plain text,
 * and parse accordingly.
 */
export function parseHotelList(html: string, text: string): Hotel[] {
  if (html) {
    const htmlResult = parseHotelListHTML(html);
    if (htmlResult.length > 0) return htmlResult;
  }
  return parseHotelListText(text);
}
