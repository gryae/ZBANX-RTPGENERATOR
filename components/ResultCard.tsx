"use client";

import { useState } from "react";
import type { GeneratedHotel } from "../types/hotel";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Hotel, Link2, MessageSquare, Hash, MapPin } from "lucide-react";
import { cn } from "../lib/utils";

interface ResultCardProps {
  hotel: GeneratedHotel;
  index: number;
  onChange: (updated: GeneratedHotel) => void;
}

export default function ResultCard({ hotel, index, onChange }: ResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const update = (field: keyof GeneratedHotel, value: string) => {
    onChange({ ...hotel, [field]: value });
  };

  return (
    <Card
      className={cn(
        "border-2 border-border/60 hover:border-primary/40 transition-all duration-300",
        "bg-card shadow-sm hover:shadow-md"
      )}
    >
      <CardHeader
        className="pb-3 cursor-pointer"
        onClick={() => setIsExpanded((v) => !v)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary font-bold text-sm">
              {index}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate text-foreground">
                {hotel.title || hotel.location || `Hotel ${index}`}
              </p>
              {hotel.videoLink && (
                <a
                  href={hotel.videoLink}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-primary underline underline-offset-2 hover:opacity-70 flex items-center gap-1 mt-0.5"
                >
                  <Link2 className="h-3 w-3" />
                  Video Link
                </a>
              )}
            </div>
          </div>
          <Badge variant="outline" className="shrink-0 text-xs">
            {isExpanded ? "Collapse" : "Expand"}
          </Badge>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4 pt-0">
          {/* Video Link */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium uppercase tracking-wide">
              <Link2 className="h-3 w-3" />
              Video Link
            </Label>
            <Input
              value={hotel.videoLink}
              onChange={(e) => update("videoLink", e.target.value)}
              placeholder="https://..."
              className="text-sm font-mono h-8 text-primary"
            />
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium uppercase tracking-wide">
              <Hotel className="h-3 w-3" />
              Title
            </Label>
            <Input
              value={hotel.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Hotel name..."
              className="text-sm"
            />
          </div>

          {/* Caption */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium uppercase tracking-wide">
              <MessageSquare className="h-3 w-3" />
              Caption
            </Label>
            <Textarea
              value={hotel.caption}
              onChange={(e) => update("caption", e.target.value)}
              placeholder="Caption text..."
              className="text-sm resize-none min-h-[80px] leading-relaxed"
              rows={3}
            />
          </div>

          {/* Hashtags */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium uppercase tracking-wide">
              <Hash className="h-3 w-3" />
              Hashtags
            </Label>
            <Textarea
              value={hotel.hashtags}
              onChange={(e) => update("hashtags", e.target.value)}
              placeholder="#zbanx #tiktokgo ..."
              className="text-sm resize-none min-h-[60px] font-mono text-primary/80"
              rows={2}
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium uppercase tracking-wide">
              <MapPin className="h-3 w-3" />
              Location Tag
            </Label>
            <Input
              value={hotel.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="Location..."
              className="text-sm"
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
