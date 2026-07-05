import type { Hotel } from "@/types/hotel";

/**
 * Build the Gemini prompt for generating captions for a list of hotels.
 */
export function buildPrompt(hotels: Hotel[]): string {
  const hotelList = hotels
    .map((h) => `- ${h.locationTag}`)
    .join("\n");

  return `You are a professional travel content writer.

Generate a JSON array for the following hotel list. For every hotel generate:
- title: the hotel name exactly as given
- caption: 25-40 words, friendly, natural, sounds like influencer content, includes one emoji, no quotation marks, no markdown, no numbering
- hashtags: always start with #zbanx #tiktokgo, then add relevant hashtags based on hotel name and city, all on one line separated by spaces
- location: the hotel name with no trailing underscore-number suffix

Return ONLY a valid JSON array. No markdown, no code blocks, no extra text.

Expected format:
[
  {
    "title": "",
    "caption": "",
    "hashtags": "",
    "location": ""
  }
]

Hotel list:
${hotelList}`;
}
