import type { Hotel, GeneratedHotel } from "../types/hotel";

/**
 * Client-side function that calls our Next.js API route to generate captions via Gemini.
 * The API key is handled server-side — never sent from the client.
 */
export async function generateCaptions(
  hotels: Hotel[],
  signal?: AbortSignal
): Promise<GeneratedHotel[]> {
  if (hotels.length === 0) {
    throw new Error("Hotel list is empty. Please paste at least one hotel name.");
  }

  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hotels }),
    signal,
  });

  if (!response.ok) {
    let errorMessage = `API error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.error) errorMessage = errorData.error;
    } catch {
      // Ignore JSON parse error on error response
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();

  if (!Array.isArray(data.result)) {
    throw new Error("Invalid response from Gemini. Expected a JSON array.");
  }

  // Merge videoLink from original hotel data into generated result
  return data.result.map(
    (
      item: { title: string; caption: string; hashtags: string; location: string },
      index: number
    ): GeneratedHotel => ({
      title: item.title ?? hotels[index]?.locationTag ?? "",
      caption: item.caption ?? "",
      hashtags: item.hashtags ?? "",
      location: item.location ?? hotels[index]?.locationTag ?? "",
      videoLink: hotels[index]?.videoLink ?? "",
    })
  );
}
