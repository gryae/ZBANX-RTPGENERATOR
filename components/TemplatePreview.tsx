"use client";

import type { CampaignTemplate } from "../types/hotel";
import { FileText } from "lucide-react";

interface TemplatePreviewProps {
  template: CampaignTemplate;
}

/** Splits a line into text segments and [Placeholder] segments for highlighting. */
function highlightPlaceholders(line: string): React.ReactNode[] {
  const parts = line.split(/(\[[^\]]+\])/);
  return parts.map((part, j) =>
    /^\[.+\]$/.test(part) ? (
      <span
        key={j}
        className="rounded px-0.5 font-semibold bg-primary/20 text-primary"
      >
        {part}
      </span>
    ) : (
      <span key={j}>{part}</span>
    )
  );
}

export default function TemplatePreview({ template }: TemplatePreviewProps) {
  const lines = template.rawText.split("\n");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          <FileText className="h-4 w-4" />
          Template Structure
        </div>
        <span className="text-xs text-muted-foreground">
          {template.videoCount} video slot{template.videoCount > 1 ? "s" : ""}
        </span>
      </div>

      <div className="rounded-xl border-2 border-dashed border-border/60 bg-muted/20 px-5 py-4 font-mono text-[11.5px] leading-[1.7] max-h-[260px] overflow-y-auto text-foreground/75 dark:text-foreground/60">
        {lines.map((line, i) => (
          <div key={i} className="min-h-[1.15rem]">
            {line ? highlightPlaceholders(line) : <>&nbsp;</>}
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        <span className="inline-flex items-center rounded px-1 py-0.5 bg-primary/15 text-primary font-medium">
          [Placeholders]
        </span>{" "}
        will be replaced with AI-generated content after you click Generate.
      </p>
    </div>
  );
}
