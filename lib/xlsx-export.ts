import type { GeneratedHotel } from "@/types/hotel";

/**
 * Generate and download an XLSX file in the "RTP Generic" format.
 *
 * Columns (matching the Feishu/GSheet format):
 *   A: No
 *   B: Video Link
 *   C: Caption
 *   D: Hashtags
 *   E: Location Tag
 */
export async function downloadRtpXlsx(
  hotels: GeneratedHotel[],
  filename = "rtp-generic.xlsx"
): Promise<void> {
  // Dynamically import xlsx so it doesn't bloat the initial bundle
  const XLSX = await import("xlsx");

  const headers = ["No", "Video Link", "Caption", "Hashtags", "Location Tag"];

  const rows = hotels.map((h, i) => [
    i + 1,
    h.videoLink ?? "",
    h.caption ?? "",
    h.hashtags ?? "",
    h.location ?? "",
  ]);

  const wsData = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // ── Column widths ──────────────────────────────────────────────────────────
  ws["!cols"] = [
    { wch: 6  }, // A: No
    { wch: 55 }, // B: Video Link
    { wch: 80 }, // C: Caption
    { wch: 70 }, // D: Hashtags
    { wch: 30 }, // E: Location Tag
  ];

  // ── Header row style (bold) ────────────────────────────────────────────────
  // xlsx community edition doesn't support rich styles, but we can set the
  // header row height and freeze pane for usability.
  ws["!rows"] = [{ hpt: 20 }]; // header row height

  // Freeze top row so headers stay visible while scrolling
  ws["!freeze"] = { xSplit: 0, ySplit: 1, topLeftCell: "A2" };

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "RTP Data");

  XLSX.writeFile(wb, filename);
}
