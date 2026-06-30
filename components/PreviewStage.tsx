import { useState, useEffect } from "react";
import { Loader2, Eye, EyeOff, Image as ImageIcon } from "lucide-react";
import { getDisplayStoneName } from "../lib/stoneDisplay";

export const DEMO_IMAGES = [
  {
    src: "/demo_images/image_1.jpeg",
    fileName: "image_1.jpeg",
    label: "Poolside",
  },
  {
    src: "/demo_images/image_2.jpeg",
    fileName: "image_2.jpeg",
    label: "Patio",
  },
  {
    src: "/demo_images/image_3.jpg",
    fileName: "image_3.jpg",
    label: "Walkway",
  },
  {
    src: "/demo_images/image_4.jpg",
    fileName: "image_4.jpg",
    label: "Garden",
  },
] as const;

const BRAND_LOGO_SRC = "/Wavefront.svg";

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
  onDemoSelect?: (demo: any) => void;
  loadingDemo?: string | null;
}

export default function PreviewStage({
  originalImage,
  resultImage,
  loading,
  activeStone,
  onDemoSelect,
  loadingDemo,
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
  const activeStoneDisplayName = getDisplayStoneName(activeStone?.name);

  return (
    <div className="relative flex h-full min-h-[360px] w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-inner sm:min-h-[460px] lg:min-h-[550px] lg:rounded-2xl">
      
      {currentImage ? (
        <div className="relative flex-1 w-full h-full flex items-center justify-center bg-white/20">
          <img
            src={currentImage}
            alt="Visualization Workspace"
            className="h-full max-h-[60dvh] w-auto max-w-full object-contain rounded-md shadow-xl transition-all duration-500 ease-out sm:max-h-[70dvh] lg:max-h-[80vh] lg:rounded-lg"
          />

          {/* BEFORE / AFTER SLIDE OR PILL CONTROLLER */}
          {hasResult && (
            <div className="absolute left-1/2 top-3 flex -translate-x-1/2 items-center gap-1 rounded-full border border-slate-700/80 bg-slate-950/80 p-1 text-xs text-white shadow-lg backdrop-blur-md sm:top-4">
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
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/85 p-2.5 text-white shadow-xl backdrop-blur-md sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-[80%] sm:p-3">
              <img
                src={activeStone.url}
                alt={activeStoneDisplayName}
                className="h-10 w-10 rounded-md object-cover border border-white/20"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                  {hasResult && !showOriginal ? "Rendered Design" : "Selected Design"}
                </span>
                <p className="text-xs font-bold truncate">{activeStoneDisplayName}</p>
                <p className="text-[9px] text-slate-400 truncate">SKU: {activeStone.sku || activeStoneDisplayName}</p>
              </div>
            </div>
          )}

          {/* BRANDING BADGE */}
          <div className="absolute bottom-4 right-4 hidden items-center gap-1.5 rounded-full border border-slate-700/50 bg-slate-950/70 px-3 py-1 text-[10px] font-semibold text-slate-300 backdrop-blur-xs sm:flex">
            <img
              src={BRAND_LOGO_SRC}
              alt=""
              aria-hidden="true"
              className="h-4 w-4 rounded-full bg-white object-contain p-0.5"
            />
            <span>Powered by Wavefront Studio</span>
          </div>
        </div>
      ) : (
        // EMPTY STATE: Instruction to upload room photo
        <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-white to-slate-100 p-6 text-center text-slate-500 sm:p-8">
          <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 text-slate-500 shadow-md sm:rounded-full sm:p-6">
            <ImageIcon className="h-9 w-9 sm:h-10 sm:w-10" />
          </div>
          <h4 className="text-base font-bold text-slate-900 sm:text-lg">Visualize Stone Flooring</h4>
          <p className="mt-2 max-w-xs text-sm text-slate-500 sm:max-w-sm">
            Upload a room photo and choose a stone design to preview the result.
          </p>

          {onDemoSelect && (
            <div className="mt-8 w-full max-w-4xl">
              <div className="mb-4 flex items-center justify-center gap-3">
                <span className="h-px w-12 bg-slate-200" />
                <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  Or try a demo image
                </span>
                <span className="h-px w-12 bg-slate-200" />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {DEMO_IMAGES.map((demo) => {
                  const isLoading = loadingDemo === demo.src;

                  return (
                    <button
                      key={demo.src}
                      type="button"
                      onClick={() => onDemoSelect(demo)}
                      disabled={loadingDemo !== null || loading}
                      aria-label={`Use ${demo.label} demo image`}
                      className="group/demo relative aspect-[40/30] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition-all duration-300 hover:scale-105 hover:border-sky-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
                    >
                      <img
                        src={demo.src}
                        alt=""
                        className="h-full w-full object-cover transition duration-500 group-hover/demo:scale-110"
                      />
                      <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-slate-950/90 to-transparent px-2 pb-2 pt-6 text-center text-xs font-semibold text-white">
                        {demo.label}
                      </span>
                      {isLoading && (
                        <span className="absolute inset-0 flex items-center justify-center bg-slate-950/55 text-white">
                          <Loader2 className="h-4 w-4 animate-spin text-sky-400" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* PROCESSING GLASS LOADING OVERLAY */}
      {loading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
          <div className="mx-4 flex max-w-[calc(100%-2rem)] flex-col items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/90 p-5 text-white shadow-2xl sm:p-6">
            <div className="relative flex h-12 w-12 items-center justify-center">
              <Loader2 className="absolute h-10 w-10 animate-spin text-sky-400" />
              <img
                src={BRAND_LOGO_SRC}
                alt=""
                aria-hidden="true"
                className="h-7 w-7 rounded-full bg-white object-contain p-0.5"
              />
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
