import type { GeneratedHotel } from "@/types/hotel";

/**
 * Generate and download an XLSX file in the "RTP Generic" format.
 *
 * Columns (matching the Feishu/GSheet format):
 *   A: Video Link
 *   B: Caption
 *   C: Hashtags
 *   D: Location Tag
 */
export async function downloadRtpXlsx(
  hotels: GeneratedHotel[],
  filename = "rtp-generic.xlsx"
): Promise<void> {
  // Dynamically import xlsx so it doesn't bloat the initial bundle
  const XLSX = await import("xlsx");

  const headers = ["Video Link", "Caption", "Hashtags", "Location Tag"];

  const rows = hotels.map((h) => [
    h.videoLink ?? "",
    h.caption ?? "",
    h.hashtags ?? "",
    h.location ?? "",
  ]);

  const wsData = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // ── Column widths ──────────────────────────────────────────────────────────
  ws["!cols"] = [
    { wch: 55 }, // A: Video Link
    { wch: 80 }, // B: Caption
    { wch: 70 }, // C: Hashtags
    { wch: 30 }, // D: Location Tag
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
