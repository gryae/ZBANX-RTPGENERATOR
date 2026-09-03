"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Settings, Eye, EyeOff, CheckCircle2 } from "lucide-react";

const LS_KEY = "rtp_gemini_key";

interface SettingsDialogProps {
  onApiKeyChange: (key: string) => void;
}

export default function SettingsDialog({ onApiKeyChange }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load saved key on mount
  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY) ?? "";
    setApiKey(stored);
    onApiKeyChange(stored);
  }, [onApiKeyChange]);

  const handleSave = () => {
    localStorage.setItem(LS_KEY, apiKey.trim());
    onApiKeyChange(apiKey.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setOpen(false);
    }, 1200);
  };

  const handleClear = () => {
    setApiKey("");
    localStorage.removeItem(LS_KEY);
    onApiKeyChange("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* DialogTrigger renders as a <button> — style it directly */}
      <DialogTrigger
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background text-sm font-medium transition-all hover:border-primary/60 hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Settings className="h-4 w-4" />
        <span className="sr-only">Settings</span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Configure your Gemini API key. It is stored only in your
            browser&apos;s localStorage and never sent to any server other than
            Google&apos;s Gemini API.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="gemini-api-key" className="text-sm font-medium">
              Gemini API Key
            </Label>
            <div className="relative">
              <Input
                ref={inputRef}
                id="gemini-api-key"
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIza..."
                className="pr-10 font-mono text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                }}
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Get your key at{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-2 hover:opacity-80"
              >
                Google AI Studio
              </a>
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            Clear Key
          </Button>
          <Button onClick={handleSave} disabled={saved} className="min-w-[100px]">
            {saved ? (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Saved!
              </span>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
