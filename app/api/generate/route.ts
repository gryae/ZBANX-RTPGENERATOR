import { NextRequest, NextResponse } from "next/server";
import { buildPrompt } from "@/lib/prompt";
import type { Hotel } from "@/types/hotel";

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_API_BASE =
  "https://generativelanguage.googleapis.com/v1beta/models";

// API key is stored server-side only — never exposed to the client
const GEMINI_API_KEY = "AQ.Ab8RN6ITJf25HlntNChZxCMP6NRux31xGasWMsDK4OBkoZcCfw";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { hotels } = body as { hotels: Hotel[] };

    if (!hotels || hotels.length === 0) {
      return NextResponse.json(
        { error: "Hotel list is empty." },
        { status: 400 }
      );
    }

    const prompt = buildPrompt(hotels);

    const geminiUrl = `${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const geminiPayload = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.8,
        responseMimeType: "application/json",
      },
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout

    let geminiRes: Response;
    try {
      geminiRes = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiPayload),
        signal: controller.signal,
      });
    } catch (fetchErr) {
      const isAbort =
        fetchErr instanceof Error && fetchErr.name === "AbortError";
      return NextResponse.json(
        {
          error: isAbort
            ? "Gemini request timed out. Please try again."
            : "Failed to reach Gemini API. Check your network connection.",
        },
        { status: 504 }
      );
    } finally {
      clearTimeout(timeout);
    }

    if (!geminiRes.ok) {
      const errBody = await geminiRes.json().catch(() => ({}));
      const message =
        errBody?.error?.message ??
        `Gemini API error: ${geminiRes.status} ${geminiRes.statusText}`;
      return NextResponse.json({ error: message }, { status: geminiRes.status });
    }

    const geminiData = await geminiRes.json();

    const rawText: string =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let parsed: unknown;
    try {
      const cleaned = rawText
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        {
          error:
            "Gemini returned invalid JSON. Please try again.\n\nRaw response:\n" +
            rawText.slice(0, 500),
        },
        { status: 500 }
      );
    }

    if (!Array.isArray(parsed)) {
      return NextResponse.json(
        { error: "Gemini response is not a JSON array." },
        { status: 500 }
      );
    }

    return NextResponse.json({ result: parsed });
  } catch (err) {
    console.error("[/api/generate] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
