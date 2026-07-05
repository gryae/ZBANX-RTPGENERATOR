"use client";

import { useMemo } from "react";
import type { GeneratedHotel, CampaignTemplate } from "@/types/hotel";
import { renderCampaignEmailHtml } from "@/lib/templates";
import { Mail } from "lucide-react";

interface EmailPreviewProps {
  template: CampaignTemplate;
  hotels: GeneratedHotel[];
  paymentDate: string;
  creatorName: string;
}

export default function EmailPreview({
  template,
  hotels,
  paymentDate,
  creatorName,
}: EmailPreviewProps) {
  const renderedHtml = useMemo(() => {
    if (hotels.length === 0) return "";
    return renderCampaignEmailHtml(template, hotels, paymentDate, creatorName);
  }, [template, hotels, paymentDate, creatorName]);

  if (hotels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/40 bg-muted/30 p-12 text-center">
        <Mail className="h-10 w-10 text-muted-foreground/40 mb-3" />
        <p className="text-sm text-muted-foreground">
          Generated email will appear here after you generate captions.
        </p>
      </div>
    );
  }

  return (
    <div
      className="email-body rounded-xl border-2 border-border/60 bg-card px-8 py-6 text-sm leading-7 text-foreground font-sans max-h-[600px] overflow-y-auto"
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
}
