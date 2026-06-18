import { useState } from "react";
import {
  Sparkles,
  Share2,
  Download,
  X,
  Check,
} from "lucide-react";

interface HeaderProps {
  resultUrl?: string | null;
  activeStoneName?: string;
  onRefresh?: () => void;
}

export default function Header({ resultUrl, activeStoneName }: HeaderProps) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Download logic for the modified image
  const handleDownload = async () => {
    if (!resultUrl) return;
    setDownloading(true);
    try {
      const response = await fetch(resultUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `floor-render-${activeStoneName?.toLowerCase().replace(/\s+/g, "-") || "design"}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Secure download failed, falling back to open in tab:", err);
      // Fallback
      window.open(resultUrl, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Floor Studio Design",
        text: `Check out this stone floor design: ${activeStoneName || ""}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="glass-header sticky top-0 z-50 w-screen max-w-full overflow-hidden border-b border-slate-200/60">
      <div className="flex min-h-14 w-full max-w-[100vw] items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4 lg:min-h-16 lg:px-6">
        
        {/* Left: Floor Studio Branding Logo */}
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-900 text-white shadow-md sm:h-10 sm:w-10 sm:rounded-xl">
            <Sparkles className="h-4 w-4 text-sky-300 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-xs font-bold tracking-wider text-slate-900 uppercase sm:text-sm">
              Floor Studio
            </h1>
            <p className="hidden text-[10px] font-semibold text-slate-500 sm:block">
              Stone floor visualization engine
            </p>
          </div>
        </div>

        {/* Right Actions: Share, Download, Exit */}
        <div className="ml-1 flex shrink-0 items-center justify-end gap-1 sm:ml-auto sm:gap-2 lg:gap-4">
          
          {/* Share */}
          <button
            onClick={handleShare}
            className="flex h-9 w-9 items-center justify-center gap-1.5 rounded-lg text-xs font-semibold text-slate-600 transition hover:bg-slate-100/50 hover:text-slate-900 sm:w-auto sm:px-3 sm:text-sm"
            aria-label={copied ? "Link copied" : "Share design"}
            title={copied ? "Link copied" : "Share design"}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-500" />
                <span className="hidden text-xs text-emerald-600 sm:inline">Copied link!</span>
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4 text-slate-400" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>

          {/* Download (Active only when resultUrl is present) */}
          <button
            onClick={handleDownload}
            disabled={!resultUrl || downloading}
            className={`relative h-9 w-9 items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition sm:flex sm:w-auto sm:px-3 sm:text-sm ${
              resultUrl
                ? "flex text-sky-600 hover:text-sky-800 hover:bg-slate-100/50 cursor-pointer animate-pulse"
                : "hidden text-slate-300 cursor-not-allowed opacity-50"
            }`}
            title={resultUrl ? "Download modified room render" : "Download available only after applying design"}
            aria-label={downloading ? "Downloading design" : "Download design"}
          >
            <Download className={`h-4 w-4 ${resultUrl ? "stroke-[2.5]" : ""}`} />
            <span className="hidden sm:inline">
              {downloading ? "Downloading..." : "Download"}
            </span>
            {resultUrl && (
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-sky-500 animate-ping sm:static sm:flex" />
            )}
          </button>

          {/* Divider */}
          <div className="hidden h-6 w-px bg-slate-200 sm:block" />

          {/* Exit / Reset */}
          <button
            onClick={() => window.location.reload()}
            className="flex h-9 w-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 sm:w-auto sm:px-3 sm:text-sm"
            title="Reset visualizer session"
            aria-label="Reset visualizer session"
          >
            <X className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </div>
    </header>
  );
}
