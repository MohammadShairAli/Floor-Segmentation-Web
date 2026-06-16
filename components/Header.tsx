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
    <header className="glass-header sticky top-0 z-50 h-16 w-full border-b border-slate-200">
      <div className="flex h-full items-center justify-between px-6">
        
        {/* Left: Floor Studio Branding Logo */}
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white shadow-md">
            <Sparkles className="h-5 w-5 text-sky-300" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider text-slate-900 uppercase">
              Floor Studio
            </h1>
            <p className="text-[10px] font-semibold text-slate-400">
              Stone floor visualization engine
            </p>
          </div>
        </div>

        {/* Right Actions: Share, Download, Exit */}
        <div className="flex items-center gap-4 sm:gap-6">
          
          {/* Share
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 py-1 text-xs sm:text-sm font-semibold text-slate-600 transition hover:text-slate-900"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-500" />
                <span className="text-emerald-600 text-xs">Copied link!</span>
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </>
            )}
          </button> */}

          {/* Download (Active only when resultUrl is present) */}
          <button
            onClick={handleDownload}
            disabled={!resultUrl || downloading}
            className={`flex items-center gap-1.5 py-1 text-xs sm:text-sm font-semibold transition ${
              resultUrl
                ? "text-sky-600 hover:text-sky-800 cursor-pointer animate-pulse"
                : "text-slate-300 cursor-not-allowed"
            }`}
            title={resultUrl ? "Download modified room render" : "Download available only after applying design"}
          >
            <Download className={`h-4 w-4 ${resultUrl ? "stroke-[2.5]" : ""}`} />
            <span>
              {downloading ? "Downloading..." : "Download"}
            </span>
            {resultUrl && (
              <span className="flex h-1.5 w-1.5 rounded-full bg-sky-500 animate-ping" />
            )}
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-slate-200" />

          {/* Exit / Reset */}
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-950 hover:bg-slate-50"
            title="Reset visualizer session"
          >
            <X className="h-3.5 w-3.5" />
            <span>Exit</span>
          </button>
        </div>
      </div>
    </header>
  );
}