import type { Hotel } from "../types/hotel";

/**
 * Build the Gemini prompt for generating captions for a list of hotels.
 */
export function buildPrompt(hotels: Hotel[]): string {
  const hotelList = hotels
    .map((h, i) => `${i + 1}. ${h.locationTag}`)
    .join("\n");

  return `You are a professional travel content writer.

Generate a JSON array for the following numbered hotel list. Each numbered slot must receive its own unique entry — even if the hotel name appears more than once in the list, you MUST write a completely different caption for each occurrence. Vary the angle, highlight, tone, emotion, or detail so no two captions are alike.

For every slot generate:
- title: the hotel name exactly as given
- caption: 25-40 words, friendly, natural, sounds like influencer content, includes one emoji, no quotation marks, no markdown, no numbering. MUST be unique and different from every other caption in this response.
- hashtags: always start with #zbanx #tiktokgo, then add relevant hashtags based on hotel name and city, all on one line separated by spaces
- location: the hotel name with no trailing underscore-number suffix

Return ONLY a valid JSON array with exactly ${hotels.length} elements (one per numbered slot). No markdown, no code blocks, no extra text.

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
