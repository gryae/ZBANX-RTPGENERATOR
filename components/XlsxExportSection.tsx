"use client";

import { useState } from "react";
import type { GeneratedHotel } from "@/types/hotel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { downloadRtpXlsx } from "@/lib/xlsx-export";
import {
  Table2,
  Download,
  CheckCircle2,
  Link2,
  MessageSquare,
  Hash,
  MapPin,
  Loader2,
} from "lucide-react";

interface XlsxExportSectionProps {
  hotels: GeneratedHotel[];
  filename?: string;
}

export default function XlsxExportSection({
  hotels,
  filename,
}: XlsxExportSectionProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloaded(false);
    try {
      await downloadRtpXlsx(
        hotels,
        filename ?? `rtp-generic-${new Date().toISOString().slice(0, 10)}.xlsx`
      );
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      console.error("XLSX export failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Table2 className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            XLSX Preview
          </h2>
          <Badge variant="secondary" className="text-xs">
            {hotels.length} row{hotels.length !== 1 ? "s" : ""}
          </Badge>
        </div>

        <Button
          onClick={handleDownload}
          disabled={isDownloading || hotels.length === 0}
          size="sm"
          className="gap-2 rounded-lg font-semibold"
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : downloaded ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {downloaded ? "Downloaded!" : "Download XLSX"}
        </Button>
      </div>

      {/* Table preview */}
      <div className="rounded-xl border border-border/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/60 border-b border-border/60">
                <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground whitespace-nowrap w-8">
                  #
                </th>
                <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Link2 className="h-3 w-3" />
                    Video Link
                  </div>
                </th>
                <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground whitespace-nowrap min-w-[260px]">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="h-3 w-3" />
                    Caption
                  </div>
                </th>
                <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground whitespace-nowrap min-w-[200px]">
                  <div className="flex items-center gap-1.5">
                    <Hash className="h-3 w-3" />
                    Hashtags
                  </div>
                </th>
                <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3" />
                    Location Tag
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel, i) => (
                <tr
                  key={i}
                  className="border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-3 py-2 text-muted-foreground font-mono">
                    {i + 1}
                  </td>
                  <td className="px-3 py-2 max-w-[180px]">
                    {hotel.videoLink ? (
                      <a
                        href={hotel.videoLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline underline-offset-2 hover:opacity-70 font-mono truncate block"
                        title={hotel.videoLink}
                      >
                        {hotel.videoLink.length > 40
                          ? hotel.videoLink.slice(0, 37) + "…"
                          : hotel.videoLink}
                      </a>
                    ) : (
                      <span className="text-muted-foreground/50 italic">
                        —
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 leading-relaxed text-foreground/80">
                    <div className="line-clamp-2">{hotel.caption}</div>
                  </td>
                  <td className="px-3 py-2 font-mono text-primary/80">
                    <div className="line-clamp-2">{hotel.hashtags}</div>
                  </td>
                  <td className="px-3 py-2 text-foreground/80 whitespace-nowrap">
                    {hotel.location}
                  </td>
                </tr>
              ))}

              {hotels.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-8 text-center text-muted-foreground/50 italic"
                  >
                    No data yet — generate captions first
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        The XLSX will contain 5 columns:{" "}
        <span className="font-mono bg-muted px-1 rounded">No</span>,{" "}
        <span className="font-mono bg-muted px-1 rounded">Video Link</span>,{" "}
        <span className="font-mono bg-muted px-1 rounded">Caption</span>,{" "}
        <span className="font-mono bg-muted px-1 rounded">Hashtags</span>,{" "}
        <span className="font-mono bg-muted px-1 rounded">Location Tag</span> —
        exactly matching the RTP Generic format.
      </p>
    </div>
  );
}
