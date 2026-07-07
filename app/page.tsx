"use client";

import { useState, useCallback, useMemo } from "react";
import type { Hotel, GeneratedHotel } from "@/types/hotel";
import {
  CAMPAIGN_TEMPLATES,
  renderCampaignEmailHtml,
  renderCampaignEmailText,
  formatPaymentDate,
} from "@/lib/templates";
import { generateCaptions } from "@/lib/gemini";

import TemplateSelector from "@/components/TemplateSelector";
import TemplatePreview from "@/components/TemplatePreview";
import HotelInput from "@/components/HotelInput";
import ResultCard from "@/components/ResultCard";
import EmailPreview from "@/components/EmailPreview";
import XlsxExportSection from "@/components/XlsxExportSection";
import CopyButton from "@/components/CopyButton";
import LoadingOverlay from "@/components/LoadingOverlay";
import ExportButtons from "@/components/ExportButtons";
import DarkModeToggle from "@/components/DarkModeToggle";
import PaymentDatePicker from "@/components/PaymentDatePicker";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sparkles,
  Zap,
  AlertTriangle,
  Mail,
  LayoutGrid,
  RefreshCw,
  User,
  Table2,
} from "lucide-react";

const LS_RESULT_KEY = "rtp_last_result";

export default function HomePage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    CAMPAIGN_TEMPLATES[0].id
  );
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [generatedHotels, setGeneratedHotels] = useState<GeneratedHotel[]>(
    () => {
      if (typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem(LS_RESULT_KEY);
          if (saved) return JSON.parse(saved) as GeneratedHotel[];
        } catch {
          /* ignore */
        }
      }
      return [];
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentDate, setPaymentDate] = useState(""); // "YYYY-MM-DD"
  const [creatorName, setCreatorName] = useState("");

  const selectedTemplate = useMemo(
    () =>
      CAMPAIGN_TEMPLATES.find((t) => t.id === selectedTemplateId) ??
      CAMPAIGN_TEMPLATES[0],
    [selectedTemplateId]
  );

  /** Whether the selected template produces XLSX output instead of email */
  const isXlsx = selectedTemplate.isXlsxTemplate === true;

  /** Format the stored ISO date string to "Month Day" for templates */
  const formattedPaymentDate = useMemo(() => {
    if (!paymentDate) return "";
    // Append T12:00:00 to avoid timezone offset issues
    return formatPaymentDate(new Date(paymentDate + "T12:00:00"));
  }, [paymentDate]);

  const handleHotelsChange = useCallback((newHotels: Hotel[]) => {
    setHotels(newHotels);
  }, []);

  const handleGenerate = async () => {
    setError(null);

    const required = selectedTemplate.videoCount;
    if (hotels.length === 0) {
      setError(
        "No hotels found. Please paste your hotel list into the input area."
      );
      return;
    }
    if (hotels.length < required) {
      setError(
        `This campaign requires ${required} hotel${required > 1 ? "s" : ""}. You have ${hotels.length} loaded. Please paste ${required - hotels.length} more.`
      );
      return;
    }
    if (selectedTemplate.hasPaymentDate && !paymentDate) {
      setError(
        "Please select a payment settlement date before generating."
      );
      return;
    }

    // Slice to campaign video count (XLSX template: no cap — use all hotels)
    const hotelsToSend = isXlsx ? hotels : hotels.slice(0, required);

    setIsLoading(true);
    try {
      const result = await generateCaptions(hotelsToSend);
      setGeneratedHotels(result);
      localStorage.setItem(LS_RESULT_KEY, JSON.stringify(result));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardChange = (index: number, updated: GeneratedHotel) => {
    setGeneratedHotels((prev) => {
      const next = [...prev];
      next[index] = updated;
      localStorage.setItem(LS_RESULT_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handleClearResults = () => {
    setGeneratedHotels([]);
    localStorage.removeItem(LS_RESULT_KEY);
  };

  const getEmailHtml = useCallback(
    () =>
      renderCampaignEmailHtml(
        selectedTemplate,
        generatedHotels,
        formattedPaymentDate,
        creatorName
      ),
    [selectedTemplate, generatedHotels, formattedPaymentDate, creatorName]
  );

  const getEmailText = useCallback(
    () =>
      renderCampaignEmailText(
        selectedTemplate,
        generatedHotels,
        formattedPaymentDate,
        creatorName
      ),
    [selectedTemplate, generatedHotels, formattedPaymentDate, creatorName]
  );

  // Validation state
  const required = selectedTemplate.videoCount;
  const hotelCountOk = hotels.length >= required;
  const paymentDateOk =
    !selectedTemplate.hasPaymentDate || paymentDate !== "";
  const canGenerate = hotelCountOk && paymentDateOk && !isLoading;

  // For XLSX template: pass ALL hotels (no upper-cap slicing)
  const hotelsForXlsx = isXlsx ? generatedHotels : [];

  return (
    <>
      {isLoading && <LoadingOverlay />}

      <div className="min-h-screen bg-background">
        {/* ── Header ─────────────────────────────────────────────── */}
        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-base font-bold tracking-tight text-foreground">
                    RTP Generator
                  </h1>
                  <p className="text-xs text-muted-foreground leading-none mt-0.5">
                    ZBANX Hotel Campaign Tool
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DarkModeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* ── Main ───────────────────────────────────────────────── */}
        <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">

          {/* ① Campaign Selector */}
          <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <TemplateSelector
              selectedId={selectedTemplateId}
              onSelect={(id) => {
                setSelectedTemplateId(id);
                setGeneratedHotels([]);
              }}
            />
          </section>

          {/* ② Template Preview — only for email campaigns */}
          {!isXlsx && (
            <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <TemplatePreview template={selectedTemplate} />
            </section>
          )}

          {/* ③ Hotel Input */}
          <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <HotelInput
              onHotelsChange={handleHotelsChange}
              hotelCount={hotels.length}
            />
            {/* Count validation hint */}
            {hotels.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                {hotelCountOk ? (
                  <Badge className="bg-green-500/15 text-green-600 border-green-500/30">
                    ✓ {hotels.length} hotel{hotels.length !== 1 ? "s" : ""} — ready for {selectedTemplate.name}
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/30">
                    Need {required} hotels — {required - hotels.length} more required
                  </Badge>
                )}
                {!isXlsx && hotels.length > required && (
                  <span className="text-xs text-muted-foreground">
                    (first {required} will be used)
                  </span>
                )}
                {isXlsx && (
                  <span className="text-xs text-muted-foreground">
                    All {hotels.length} will be exported
                  </span>
                )}
              </div>
            )}
          </section>

          {/* ④ Settings: Payment Date + Creator Name */}
          {(selectedTemplate.hasPaymentDate || selectedTemplate.hasCreatorName) && (
            <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {selectedTemplate.hasPaymentDate && (
                  <PaymentDatePicker
                    value={paymentDate}
                    onChange={setPaymentDate}
                  />
                )}
                {selectedTemplate.hasCreatorName && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="creator-name"
                      className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      <User className="h-4 w-4" />
                      Creator Name
                    </Label>
                    <Input
                      id="creator-name"
                      type="text"
                      value={creatorName}
                      onChange={(e) => setCreatorName(e.target.value)}
                      placeholder="e.g. Sarah"
                      className="rounded-xl border-2 border-border/60 h-11 text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Replaces <span className="font-mono bg-muted px-1 rounded">[Creator Name]</span> in the greeting
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="rounded-2xl">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="whitespace-pre-wrap">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* ⑤ Generate Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleGenerate}
              disabled={!canGenerate}
              size="lg"
              className="gap-2.5 rounded-xl px-10 py-6 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              {isXlsx ? <Table2 className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
              {isLoading
                ? "Generating..."
                : isXlsx
                ? `Generate Captions for ${hotels.length} Hotel${hotels.length !== 1 ? "s" : ""} → XLSX`
                : `Generate ${selectedTemplate.videoCount} Caption${selectedTemplate.videoCount > 1 ? "s" : ""} — ${selectedTemplate.price}`}
            </Button>
          </div>

          {/* ⑥ Results */}
          {generatedHotels.length > 0 && (
            <>
              <Separator />

              {/* ⑥a Generated Cards */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Generated Cards
                    </h2>
                    <Badge variant="secondary" className="text-xs">
                      {generatedHotels.length}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearResults}
                    className="gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-xs"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Clear Results
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {generatedHotels.map((hotel, i) => (
                    <ResultCard
                      key={i}
                      hotel={hotel}
                      index={i + 1}
                      onChange={(updated) => handleCardChange(i, updated)}
                    />
                  ))}
                </div>
              </section>

              <Separator />

              {/* ⑥b: XLSX Export (only for XLSX template) */}
              {isXlsx ? (
                <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
                  <XlsxExportSection hotels={hotelsForXlsx} />
                </section>
              ) : (
                /* ⑥b: Generated Email (email campaign templates) */
                <section className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Generated Email
                      </h2>
                      <Badge variant="secondary" className="text-xs">
                        {selectedTemplate.name}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <CopyButton getHtml={getEmailHtml} getText={getEmailText} />
                      <ExportButtons getHtml={getEmailHtml} getText={getEmailText} />
                    </div>
                  </div>

                  <EmailPreview
                    template={selectedTemplate}
                    hotels={generatedHotels}
                    paymentDate={formattedPaymentDate}
                    creatorName={creatorName}
                  />
                </section>
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-16 border-t border-border/40 py-6">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center text-xs text-muted-foreground">
            RTP Generator
          </div>
        </footer>
      </div>
    </>
  );
}
