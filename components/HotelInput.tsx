"use client";

import {
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { parseHotelList } from "@/lib/parser";
import type { Hotel } from "@/types/hotel";
import { ClipboardList, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const LS_KEY = "rtp_hotel_list_html";

interface HotelInputProps {
  onHotelsChange: (hotels: Hotel[]) => void;
  hotelCount: number;
}

export interface HotelInputHandle {
  clear: () => void;
}

const HotelInput = forwardRef<HotelInputHandle, HotelInputProps>(
  ({ onHotelsChange, hotelCount }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);

    // Expose clear method to parent
    useImperativeHandle(ref, () => ({
      clear: () => {
        if (editorRef.current) {
          editorRef.current.innerHTML = "";
        }
        localStorage.removeItem(LS_KEY);
        onHotelsChange([]);
      },
    }));

    // Restore from localStorage on mount
    useEffect(() => {
      const saved = localStorage.getItem(LS_KEY);
      if (saved && editorRef.current) {
        editorRef.current.innerHTML = saved;
        // Re-parse saved HTML
        const hotels = parseHotelList(saved, editorRef.current.innerText ?? "");
        onHotelsChange(hotels);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePaste = useCallback(
      (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();

        const htmlData = e.nativeEvent.clipboardData?.getData("text/html") ?? "";
        const textData = e.nativeEvent.clipboardData?.getData("text/plain") ?? "";

        const hotels = parseHotelList(htmlData, textData);

        if (editorRef.current) {
          if (htmlData && hotels.length > 0) {
            // Render anchors as visible links in the editor
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlData, "text/html");
            const anchors = Array.from(doc.querySelectorAll("a"));

            if (anchors.length > 0) {
              const lines = anchors
                .map((a) => {
                  const text = a.textContent?.trim() ?? "";
                  const href = a.getAttribute("href") ?? "";
                  if (!text) return "";
                  return href
                    ? `<div><a href="${href}" target="_blank" rel="noreferrer" class="text-primary underline">${text}</a></div>`
                    : `<div>${text}</div>`;
                })
                .filter(Boolean)
                .join("");
              editorRef.current.innerHTML = lines;
            } else {
              // Plain text in HTML wrapper — just use text lines
              const lines = textData
                .split("\n")
                .filter((l) => l.trim())
                .map((l) => `<div>${l.trim()}</div>`)
                .join("");
              editorRef.current.innerHTML = lines;
            }
          } else {
            // Plain text fallback
            const lines = textData
              .split("\n")
              .filter((l) => l.trim())
              .map((l) => `<div>${l.trim()}</div>`)
              .join("");
            editorRef.current.innerHTML = lines;
          }

          // Save to localStorage
          localStorage.setItem(LS_KEY, editorRef.current.innerHTML);
        }

        onHotelsChange(hotels);
      },
      [onHotelsChange]
    );

    const handleInput = useCallback(() => {
      if (!editorRef.current) return;
      const html = editorRef.current.innerHTML;
      const text = editorRef.current.innerText ?? "";
      localStorage.setItem(LS_KEY, html);
      const hotels = parseHotelList(html, text);
      onHotelsChange(hotels);
    }, [onHotelsChange]);

    const handleClear = () => {
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
      localStorage.removeItem(LS_KEY);
      onHotelsChange([]);
    };

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            <ClipboardList className="h-4 w-4" />
            Hotel List
          </div>
          <div className="flex items-center gap-2">
            {hotelCount > 0 && (
              <Badge
                variant="secondary"
                className="bg-primary/15 text-primary border-primary/30 font-semibold animate-in fade-in-0 slide-in-from-right-2"
              >
                {hotelCount} Hotel{hotelCount !== 1 ? "s" : ""} Loaded
              </Badge>
            )}
            {hotelCount > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={handleClear}
                title="Clear hotel list"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onPaste={handlePaste}
          onInput={handleInput}
          className="min-h-[180px] max-h-[320px] overflow-y-auto rounded-xl border-2 border-border/60 bg-card px-4 py-3 text-sm leading-7 focus:outline-none focus:border-primary/60 transition-colors empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50 empty:before:pointer-events-none"
          data-placeholder="Paste hotel list from Feishu here... (supports hyperlinks)"
          spellCheck={false}
        />

        <p className="text-xs text-muted-foreground">
          Paste directly from Feishu Sheets. Hyperlinks are automatically preserved.
          Supports plain text fallback.
        </p>
      </div>
    );
  }
);

HotelInput.displayName = "HotelInput";

export default HotelInput;
