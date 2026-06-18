"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import Header from "../components/Header";
import UploadPanel from "../components/UploadPanel";
import StoneSelector from "../components/StoneSelector";
import ResultPanel from "../components/ResultPanel";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export default function Home() {
  const [stones, setStones] = useState([]);
  const [selectedStone, setSelectedStone] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStones, setLoadingStones] = useState(true);
  const [error, setError] = useState("");

  const activeStone = useMemo(
    () => stones.find((s: any) => s.id === selectedStone),
    [stones, selectedStone]
  );

  useEffect(() => {
    loadStones();
  }, []);

  async function loadStones() {
    setLoadingStones(true);
    try {
      const res = await fetch(`${API_BASE}/api/stones/`);
      const data = await res.json();
      setStones(data.stones || []);
      setSelectedStone(data.stones?.[0]?.id || "");
    } catch (err) {
      console.error("Failed to load stones from backend api:", err);
      setError("Unable to connect to the floor studio database.");
    } finally {
      setLoadingStones(false);
    }
  }


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!imageFile || !selectedStone) return;

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const form = new FormData();
      form.append("image", imageFile);
      form.append("stone_id", selectedStone);

      const res = await fetch(`${API_BASE}/api/apply/`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        throw new Error("Failed to process the design mask.");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError("An error occurred while rendering the floor. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh w-full flex-col overflow-x-hidden bg-slate-100 text-slate-700 lg:h-dvh lg:overflow-hidden">
      
      {/* TOP COMPONENT HEADER BAR */}
      <Header
        resultUrl={result?.result_url}
        activeStoneName={activeStone?.["name"]}
      />

      {/* VIEWPORT FILLING GRID LAYOUT */}
      <div className="flex min-w-0 flex-1 flex-col lg:flex-row lg:overflow-hidden">
        
        {/* LEFT CONTROL SIDEBAR PANEL */}
        <aside className="z-10 flex w-full min-w-0 max-w-full shrink-0 flex-col overflow-x-hidden border-b border-slate-200 bg-white/85 shadow-xs backdrop-blur-xl lg:h-full lg:w-[380px] lg:border-b-0 lg:border-r lg:bg-white/70">
          
          {/* Sidebar controls title */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-4 py-3 sm:px-5 lg:py-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Design Controls
            </h2>
          </div>

          {/* Form Scrollable Area */}
          <form
            onSubmit={handleSubmit}
            className="flex min-w-0 flex-col gap-4 p-4 sm:p-5 lg:flex-1 lg:overflow-hidden"
          >
            <div className="min-w-0 space-y-4 lg:flex-1 lg:overflow-y-auto lg:pr-1">
              
              {/* Error messages if any */}
              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600 animate-shake">
                  {error}
                </div>
              )}

              {/* ROOM UPLOADER */}
              <UploadPanel
                setImageFile={setImageFile}
                setImagePreview={setImagePreview}
                imagePreview={imagePreview}
                imageFile={imageFile}
              />

              {/* PRODUCT SELECTOR */}
              <StoneSelector
                stones={stones}
                loading={loadingStones}
                selectedStone={selectedStone}
                setSelectedStone={setSelectedStone}
              />
            </div>

            {/* APPLY DESIGN CTA BUTTON */}
            <div className="sticky bottom-0 -mx-4 border-t border-slate-100 bg-white/95 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:-mx-5 sm:px-5 lg:static lg:mx-0 lg:bg-transparent lg:p-0 lg:pt-4">
              <button
                type="submit"
                disabled={loading || !imageFile || !selectedStone}
                className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl font-bold bg-blue-700 text-white shadow-md transition duration-300 ${
                  loading
                    ? "bg-slate-700 cursor-wait opacity-80"
                    : !imageFile || !selectedStone
                    ? "bg-slate-300 text-slate-500 shadow-none cursor-not-allowed"
                    : "bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 hover:shadow-lg active:scale-98"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Rendering...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    <span>Apply Design</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </aside>

        {/* RIGHT VISUAL WORKSPACE AREA */}
        <main className="flex min-h-[420px] flex-1 flex-col items-center justify-center bg-slate-900/10 p-3 sm:p-5 lg:h-full lg:min-h-0 lg:overflow-hidden lg:p-6">
          <ResultPanel
            result={result}
            loading={loading}
            preview={imagePreview}
            activeStone={activeStone}
          />
        </main>
      </div>
    </div>
  );
}
