"use client";

import { Button } from "./ui/button";
import { Download } from "lucide-react";

interface ExportButtonsProps {
  getHtml: () => string;
  getText: () => string;
}

function triggerDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const HTML_WRAPPER = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>RTP Generator Export</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 680px; margin: 40px auto; line-height: 1.7; color: #1a1a1a; }
    a { color: #2563eb; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 16px 0; }
    p { margin: 4px 0; }
    strong { font-weight: 600; }
  </style>
</head>
<body>
{{body}}
</body>
</html>`;

export default function ExportButtons({ getHtml, getText }: ExportButtonsProps) {
  const timestamp = () => new Date().toISOString().slice(0, 10);

  const exportHtml = () => {
    const html = getHtml();
    const full = HTML_WRAPPER.replace("{{body}}", html);
    triggerDownload(full, `rtp-email-${timestamp()}.html`, "text/html");
  };

  const exportTxt = () => {
    const text = getText();
    triggerDownload(text, `rtp-email-${timestamp()}.txt`, "text/plain");
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        variant="outline"
        size="sm"
        onClick={exportHtml}
        className="gap-2 rounded-lg border-border/60 hover:border-primary/40"
      >
        <Download className="h-4 w-4" />
        Export HTML
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={exportTxt}
        className="gap-2 rounded-lg border-border/60 hover:border-primary/40"
      >
        <Download className="h-4 w-4" />
        Export TXT
      </Button>
    </div>
  );
}
