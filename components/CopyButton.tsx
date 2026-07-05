"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCheck, FileText, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  getHtml: () => string;
  getText: () => string;
  className?: string;
}

export default function CopyButton({ getHtml, getText, className }: CopyButtonProps) {
  const [copiedPlain, setCopiedPlain] = useState(false);
  const [copiedRich, setCopiedRich] = useState(false);

  const copyPlain = async () => {
    const text = getText();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPlain(true);
      setTimeout(() => setCopiedPlain(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopiedPlain(true);
      setTimeout(() => setCopiedPlain(false), 2000);
    }
  };

  const copyRich = async () => {
    const html = getHtml();
    const text = getText();
    try {
      const blob = new Blob([html], { type: "text/html" });
      const plainBlob = new Blob([text], { type: "text/plain" });
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": blob,
          "text/plain": plainBlob,
        }),
      ]);
      setCopiedRich(true);
      setTimeout(() => setCopiedRich(false), 2000);
    } catch {
      await copyPlain();
    }
  };

  return (
    <div className={cn("flex gap-2 flex-wrap", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={copyPlain}
        className="gap-2 rounded-lg border-border/60 hover:border-primary/40"
      >
        {copiedPlain ? (
          <>
            <CheckCheck className="h-4 w-4 text-green-500" />
            <span className="text-green-600">Copied!</span>
          </>
        ) : (
          <>
            <FileText className="h-4 w-4" />
            Copy as Plain Text
          </>
        )}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={copyRich}
        className="gap-2 rounded-lg border-border/60 hover:border-primary/40"
      >
        {copiedRich ? (
          <>
            <CheckCheck className="h-4 w-4 text-green-500" />
            <span className="text-green-600">Copied!</span>
          </>
        ) : (
          <>
            <Code2 className="h-4 w-4" />
            Copy as Rich Text
          </>
        )}
      </Button>
    </div>
  );
}
