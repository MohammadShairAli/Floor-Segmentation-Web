import { useState, useEffect } from "react";
import { Loader2, Eye, EyeOff, Sparkles, Image as ImageIcon } from "lucide-react";

interface PreviewStageProps {
  originalImage: string | null;
  resultImage: string | null;
  loading: boolean;
  activeStone?: {
    id: string;
    name: string;
    url: string;
    sku?: string;
  } | null;
}

export default function PreviewStage({
  originalImage,
  resultImage,
  loading,
  activeStone,
}: PreviewStageProps) {
  const [showOriginal, setShowOriginal] = useState(false);

  // If new result arrives, make sure we show the rendered image
  useEffect(() => {
    if (resultImage) {
      setShowOriginal(false);
    }
  }, [resultImage]);

  const hasResult = !!resultImage;
  const currentImage = showOriginal ? originalImage : (resultImage || originalImage);

  return (
    <div className="relative flex h-full min-h-[550px] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-inner">
      
      {currentImage ? (
        <div className="relative flex-1 w-full h-full flex items-center justify-center bg-white/20">
          <img
            src={currentImage}
            alt="Visualization Workspace"
            className="h-full max-h-[80vh] w-auto max-w-full object-contain rounded-lg shadow-xl transition-all duration-500 ease-out"
          />

          {/* BEFORE / AFTER SLIDE OR PILL CONTROLLER */}
          {hasResult && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-950/80 p-1 text-xs text-white backdrop-blur-md shadow-lg">
              <button
                type="button"
                onClick={() => setShowOriginal(true)}
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 font-semibold transition ${
                  showOriginal
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <EyeOff className="h-3.5 w-3.5" />
                Original
              </button>
              <button
                type="button"
                onClick={() => setShowOriginal(false)}
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 font-semibold transition ${
                  !showOriginal
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                Visualized
              </button>
            </div>
          )}

          {/* ACTIVE STONE OVERLAY DETAILS */}
          {activeStone && (
            <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/85 p-3 text-white backdrop-blur-md shadow-xl max-w-[80%]">
              <img
                src={activeStone.url}
                alt={activeStone.name}
                className="h-10 w-10 rounded-md object-cover border border-white/20"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                  {hasResult && !showOriginal ? "Rendered Design" : "Selected Design"}
                </span>
                <p className="text-xs font-bold truncate">{activeStone.name}</p>
                <p className="text-[9px] text-slate-400 truncate">SKU: {activeStone.sku || activeStone.name}</p>
              </div>
            </div>
          )}

          {/* BRANDING BADGE */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full border border-slate-700/50 bg-slate-950/70 px-3 py-1 text-[10px] font-semibold text-slate-300 backdrop-blur-xs">
            <Sparkles className="h-3 w-3 text-sky-400 animate-spin-slow" />
            <span>Powered by Floor Studio</span>
          </div>
        </div>
      ) : (
        // EMPTY STATE: Instruction to upload room photo
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-slate-400">
          <div className="mb-4 rounded-full bg-slate-900 border border-slate-800 p-6 text-slate-500 shadow-md">
            <ImageIcon className="h-10 w-10" />
          </div>
          <h4 className="text-lg font-bold text-white">Visualize Stone Flooring</h4>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Upload your room photo using the sidebar panel on the left and select a stone design to visualize the result.
          </p>
        </div>
      )}

      {/* PROCESSING GLASS LOADING OVERLAY */}
      {loading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/90 p-6 text-white shadow-2xl">
            <div className="relative flex h-12 w-12 items-center justify-center">
              <Loader2 className="absolute h-10 w-10 animate-spin text-sky-400" />
              <Sparkles className="h-5 w-5 text-sky-300" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold">Applying Floor Design...</p>
              <p className="text-xs text-slate-400 mt-1">Generating segmentation & mapping mask</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}