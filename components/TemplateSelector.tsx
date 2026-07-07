"use client";

import type { CampaignTemplate } from "@/types/hotel";
import { CAMPAIGN_TEMPLATES } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { CheckCircle2, Video, Table2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TemplateSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

const descriptions: Record<string, string> = {
  "campaign-8": "1 ready-to-post video",
  "campaign-15": "4 ready-to-post videos",
  "campaign-30": "10 ready-to-post videos",
  "rtp-generic-xlsx": "Unlimited hotels → XLSX download",
};

export default function TemplateSelector({
  selectedId,
  onSelect,
}: TemplateSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        <Video className="h-4 w-4" />
        Campaign Type
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CAMPAIGN_TEMPLATES.map((template: CampaignTemplate) => {
          const isSelected = selectedId === template.id;
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template.id)}
              className={cn(
                "relative flex flex-col items-start gap-1.5 rounded-xl border-2 p-5 text-left cursor-pointer transition-all duration-200 group",
                "hover:border-primary/60 hover:shadow-md hover:-translate-y-0.5",
                isSelected
                  ? "border-primary bg-primary/10 shadow-md"
                  : "border-border bg-card"
              )}
            >
              {isSelected && (
                <CheckCircle2 className="absolute top-3 right-3 h-4 w-4 text-primary" />
              )}
              <div
                className={cn(
                  "text-3xl font-extrabold tracking-tight transition-colors",
                  isSelected
                    ? "text-primary"
                    : "text-foreground group-hover:text-primary/80"
                )}
              >
                {template.isXlsxTemplate ? (
                  <span className="flex items-center gap-2">
                    <Table2 className="h-7 w-7" />
                    XLSX
                  </span>
                ) : (
                  template.price
                )}
              </div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground/80">
                <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                {template.isXlsxTemplate ? (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                    Generic Format
                  </Badge>
                ) : (
                  <>
                    {template.videoCount} Video
                    {template.videoCount > 1 ? "s" : ""}
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                {descriptions[template.id]}
              </p>
              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
