"use client";

import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  message?: string;
}

export default function LoadingOverlay({
  message = "Generating captions with Gemini AI...",
}: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card px-10 py-8 shadow-xl">
        <div className="relative">
          <div className="h-14 w-14 rounded-full border-4 border-primary/20" />
          <Loader2 className="absolute inset-0 h-14 w-14 animate-spin text-primary" />
        </div>
        <div className="text-center space-y-1">
          <p className="font-semibold text-foreground">{message}</p>
          <p className="text-sm text-muted-foreground">
            This may take a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
