"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Download,
  ImagePlus,
  Loader2,
  RefreshCw,
  Sparkles,
  UploadCloud,
} from "lucide-react";

type Stone = {
  id: string;
  name: string;
  scale: number;
  url: string;
};

type ApplyResponse = {
  result_url: string;
  mask_url: string;
  stone: Stone;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export default function Home() {
  const [stones, setStones] = useState<Stone[]>([]);
  const [selectedStone, setSelectedStone] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [result, setResult] = useState<ApplyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStones, setLoadingStones] = useState(true);
  const [error, setError] = useState("");

  const activeStone = useMemo(
    () => stones.find((stone) => stone.id === selectedStone),
    [selectedStone, stones],
  );

  useEffect(() => {
    loadStones();
  }, []);

  async function loadStones() {
    setLoadingStones(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/stones/`);
      if (!response.ok) throw new Error("Could not load stone designs.");
      const data = await response.json();
      const nextStones = data.stones ?? [];
      setStones(nextStones);
      setSelectedStone((current) => current || nextStones[0]?.id || "");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load stones.");
    } finally {
      setLoadingStones(false);
    }
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setImageFile(file);
    setResult(null);
    setError("");

    if (!file) {
      setImagePreview("");
      return;
    }

    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!imageFile || !selectedStone) {
      setError("Choose a room image and a stone design first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("stone_id", selectedStone);

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/apply/`, {
        method: "POST",
        body: formData,
      });
      const contentType = response.headers.get("content-type") ?? "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : { detail: await response.text() };
      if (!response.ok) throw new Error(data.detail ?? "Could not apply design.");
      setResult(data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not apply design.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    if (!result?.result_url) return;

    const response = await fetch(result.result_url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = `floor-design-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  }

  return (
    <main className="min-h-screen bg-[#f5f8fb] text-ink">
      <header className="border-b border-slate-200 bg-white/92 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded bg-ink text-sky">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-normal">Floor Studio</h1>
              <p className="text-sm text-slate-500">Professional stone floor visualization</p>
            </div>
          </div>

          <button
            type="button"
            onClick={loadStones}
            className="inline-flex h-10 items-center gap-2 rounded border border-slate-200 bg-white px-3 text-sm text-ink shadow-sm transition hover:border-sky hover:text-sky"
            title="Refresh stones"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="mx-auto grid max-w-7xl gap-5 px-5 py-6 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-5">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold">Room Image</h2>
              <ImagePlus className="h-5 w-5 text-[#5da7dc]" />
            </div>

            <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#8ABFE7] bg-[#8ABFE7]/10 px-4 text-center transition hover:bg-[#8ABFE7]/18">
              <UploadCloud className="mb-3 h-8 w-8 text-[#4b9ed8]" />
              <span className="text-sm font-medium">Upload floor image</span>
              <span className="mt-1 text-xs text-slate-500">JPG, PNG, or WEBP</span>
              <input className="sr-only" type="file" accept="image/*" onChange={handleImageChange} />
            </label>

            {imageFile ? (
              <p className="mt-3 truncate text-sm text-slate-600">{imageFile.name}</p>
            ) : null}
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold">Stone Design</h2>
              <span className="text-xs text-[#4b9ed8]">{stones.length} loaded</span>
            </div>

            {loadingStones ? (
              <div className="flex h-32 items-center justify-center text-slate-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading designs
              </div>
            ) : (
              <div className="grid max-h-[430px] grid-cols-2 gap-3 overflow-y-auto pr-1">
                {stones.map((stone) => (
                  <button
                    key={stone.id}
                    type="button"
                    onClick={() => setSelectedStone(stone.id)}
                    className={`group overflow-hidden rounded-lg border text-left transition ${
                      selectedStone === stone.id
                        ? "border-[#8ABFE7] bg-[#8ABFE7]/12 shadow-sm"
                        : "border-slate-200 bg-white hover:border-[#8ABFE7]"
                    }`}
                  >
                    <div className="relative aspect-square bg-slate-100">
                      <img src={stone.url} alt={stone.name} className="h-full w-full object-cover" />
                      {selectedStone === stone.id ? (
                        <CheckCircle2 className="absolute right-2 top-2 h-5 w-5 rounded-full bg-ink text-sky" />
                      ) : null}
                    </div>
                    <div className="p-2">
                      <p className="truncate text-xs font-medium text-ink">{stone.name}</p>
                      <p className="mt-1 text-[11px] text-slate-500">Scale {stone.scale}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading || !imageFile || !selectedStone}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded bg-[#8ABFE7] px-4 font-semibold text-ink shadow-sm transition hover:bg-[#a2d4f2] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            Apply Design
          </button>
        </aside>

        <section className="min-h-[720px] rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Result Preview</h2>
              <p className="text-sm text-slate-500">
                {result
                  ? `Applied: ${result.stone.name}`
                  : activeStone
                    ? `Ready with ${activeStone.name}`
                    : "Upload an image and select a stone"}
              </p>
            </div>
            {result ? (
              <div className="flex items-center gap-2">
                <a
                  href={result.result_url}
                  target="_blank"
                  className="rounded border border-[#8ABFE7] bg-[#8ABFE7]/12 px-3 py-2 text-sm font-medium text-ink transition hover:bg-[#8ABFE7]/22"
                >
                  Open Result
                </a>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 rounded bg-ink px-3 py-2 text-sm font-medium text-white transition hover:bg-[#2f3a42]"
                >
                  <Download className="h-4 w-4 text-sky" />
                  Download
                </button>
              </div>
            ) : null}
          </div>

          <ResultPanel
            image={result?.result_url ?? imagePreview}
            hasResult={Boolean(result)}
            loading={loading}
            emptyText="Upload a room image, select a stone, and apply the design"
          />
        </section>
      </form>
    </main>
  );
}

function ResultPanel({
  image,
  hasResult,
  loading,
  emptyText,
}: {
  image: string;
  hasResult: boolean;
  loading: boolean;
  emptyText: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-[#f8fbfd] p-3">
      <div className="relative grid min-h-[620px] place-items-center overflow-hidden rounded bg-white">
        {image ? (
          <img src={image} alt="Floor design result" className="h-auto max-h-[820px] w-full object-contain" />
        ) : (
          <span className="px-4 text-center text-sm text-slate-400">{emptyText}</span>
        )}

        {loading ? (
          <div className="absolute inset-0 grid place-items-center bg-white/72 backdrop-blur-sm">
            <div className="inline-flex items-center gap-3 rounded bg-ink px-4 py-3 text-sm font-medium text-white shadow-panel">
              <Loader2 className="h-5 w-5 animate-spin text-sky" />
              Processing floor design
            </div>
          </div>
        ) : null}

        {image && !hasResult && !loading ? (
          <div className="absolute bottom-4 left-4 rounded bg-white/90 px-3 py-2 text-sm text-slate-600 shadow-sm">
            Preview image loaded
          </div>
        ) : null}

        {hasResult ? (
          <div className="absolute bottom-4 left-4 rounded bg-ink px-3 py-2 text-sm font-medium text-white shadow-sm">
            Final result
          </div>
        ) : null}
      </div>
    </div>
  );
}
