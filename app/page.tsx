"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/Header";
import UploadPanel from "../components/UploadPanel";
import StoneSelector from "../components/StoneSelector";
import ResultPanel from "../components/ResultPanel";
import { DEMO_IMAGES } from "../components/PreviewStage";

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
  const [loadingDemo, setLoadingDemo] = useState<string | null>(null);
  const latestRenderRef = useRef(0);

  const clearVisualization = () => {
    latestRenderRef.current += 1;
    setLoading(false);
    setResult(null);
  };

  const handleDemoSelect = async (demo: typeof DEMO_IMAGES[number]) => {
    setLoadingDemo(demo.src);
    setError("");

    try {
      const response = await fetch(demo.src);

      if (!response.ok) {
        throw new Error(`Unable to load ${demo.fileName}`);
      }

      const blob = await response.blob();
      const file = new File([blob], demo.fileName, {
        type: blob.type || "image/jpeg",
      });

      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }

      clearVisualization();
      setImageFile(file);
      setImagePreview(demo.src);
    } catch (error) {
      console.error("Failed to load demo image:", error);
      setError("Could not load that demo image. Please try another one.");
    } finally {
      setLoadingDemo(null);
    }
  };

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
      setError("Unable to connect to the Wavefront Studio database.");
    } finally {
      setLoadingStones(false);
    }
  }


  async function applyDesign(file: File, stoneId: string) {
    const renderId = latestRenderRef.current + 1;
    latestRenderRef.current = renderId;

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const form = new FormData();
      form.append("image", file);
      form.append("stone_id", stoneId);

      const res = await fetch(`${API_BASE}/api/apply/`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        throw new Error("Failed to process the design mask.");
      }

      const data = await res.json();
      if (latestRenderRef.current === renderId) {
        setResult(data);
      }
    } catch (err: any) {
      console.error(err);
      if (latestRenderRef.current === renderId) {
        setError("An error occurred while rendering the floor. Please try again.");
      }
    } finally {
      if (latestRenderRef.current === renderId) {
        setLoading(false);
      }
    }
  }

  const handleStoneSelect = (stoneId: string) => {
    setSelectedStone(stoneId);

    if (imageFile) {
      void applyDesign(imageFile, stoneId);
    }
  };

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
          <div className="flex min-w-0 flex-col gap-4 p-4 sm:p-5 lg:flex-1 lg:overflow-hidden">
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
                onClearImage={clearVisualization}
              />

              {/* MOBILE VISUAL WORKSPACE AREA */}
              <div className="flex min-h-[360px] flex-col items-center justify-center bg-slate-900/10 p-3 lg:hidden">
                <ResultPanel
                  result={result}
                  loading={loading}
                  preview={imagePreview}
                  activeStone={activeStone}
                  onDemoSelect={handleDemoSelect}
                  loadingDemo={loadingDemo}
                />
              </div>

              {/* PRODUCT SELECTOR */}
              <StoneSelector
                stones={stones}
                loading={loadingStones}
                selectedStone={selectedStone}
                setSelectedStone={handleStoneSelect}
              />
            </div>
          </div>
        </aside>

        {/* RIGHT VISUAL WORKSPACE AREA */}
        <main className="hidden min-h-[420px] flex-1 flex-col items-center justify-center bg-slate-900/10 p-3 sm:p-5 lg:flex lg:h-full lg:min-h-0 lg:overflow-hidden lg:p-6">
          <ResultPanel
            result={result}
            loading={loading}
            preview={imagePreview}
            activeStone={activeStone}
            onDemoSelect={handleDemoSelect}
            loadingDemo={loadingDemo}
          />
        </main>
      </div>
    </div>
  );
}
