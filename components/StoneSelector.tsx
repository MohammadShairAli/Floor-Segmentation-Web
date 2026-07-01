import { useState, useMemo } from "react";
import { Search, Grid, List, Heart, ArrowRight, Loader2 } from "lucide-react";
import { getDisplayStoneName } from "../lib/stoneDisplay";

interface Stone {
  id: string;
  name: string;
  url: string;
  sku?: string;
  detailsUrl?: string;
}

interface StoneSelectorProps {
  stones: Stone[];
  loading: boolean;
  selectedStone: string;
  setSelectedStone: (id: string) => void;
}

export default function StoneSelector({
  stones,
  loading,
  selectedStone,
  setSelectedStone,
}: StoneSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  // Filter stones based on search query
  const filteredStones = useMemo(() => {
    return stones.filter(
      (s) => {
        const displayName = getDisplayStoneName(s.name).toLowerCase();
        const query = searchQuery.toLowerCase();

        return (
          displayName.includes(query) ||
          s.name.toLowerCase().includes(query) ||
          (s.sku && s.sku.toLowerCase().includes(query))
        );
      }
    );
  }, [stones, searchQuery]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card selection
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const markImageLoaded = (id: string) => {
    setLoadedImages((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  return (
    <div className="glass-panel flex w-full min-w-0 max-w-full flex-col overflow-hidden rounded-xl p-4 transition-all duration-300 hover:shadow-md sm:rounded-2xl sm:p-5 lg:min-h-0 lg:flex-1">
      
      {/* Header with Search and Grid/List Toggles */}
      <div className="mb-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold tracking-wide text-slate-700 uppercase">
            Stone Designs
          </h3>
          <span className="text-xs font-semibold text-slate-400">
            {filteredStones.length} items
          </span>
        </div>

        {/* Search Input and Toggles */}
        <div className="flex min-w-0 items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search designs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-sky-400 focus:bg-white sm:h-9 sm:text-xs"
            />
          </div>

          <div className="hidden shrink-0 rounded-lg border border-slate-200 bg-slate-50 p-0.5 sm:flex">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`rounded-md p-2 transition sm:p-1.5 ${
                viewMode === "grid"
                  ? "bg-white text-slate-900 shadow-xs border-slate-200"
                  : "text-slate-400 hover:text-slate-600"
              }`}
              title="Grid view"
            >
              <Grid className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`rounded-md p-2 transition sm:p-1.5 ${
                viewMode === "list"
                  ? "bg-white text-slate-900 shadow-xs border-slate-200"
                  : "text-slate-400 hover:text-slate-600"
              }`}
              title="List view"
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Content List */}
      <div className="max-h-[48dvh] flex-1 overflow-y-auto pr-1 sm:max-h-[420px] lg:min-h-0 lg:max-h-none">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin text-slate-300 mb-2" />
            <span className="text-xs">Loading collection...</span>
          </div>
        ) : filteredStones.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No matching designs found.
          </div>
        ) : viewMode === "grid" ? (
          // GRID VIEW
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-2">
            {filteredStones.map((s) => {
              const isSelected = selectedStone === s.id;
              const isFav = !!favorites[s.id];
              const imageLoaded = !!loadedImages[s.id];
              const displayName = getDisplayStoneName(s.name);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedStone(s.id)}
                  className={`group relative flex min-w-0 flex-col overflow-hidden rounded-xl border text-left transition-all duration-300 ${
                    isSelected
                      ? "border-sky-500 bg-sky-50/20 shadow-xs ring-1 ring-sky-500"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
                  }`}
                >
                  {/* Thumbnail Image */}
                  <div className="relative h-24 w-full overflow-hidden bg-slate-100 sm:h-28 lg:h-24">
                    {!imageLoaded && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100">
                        <Loader2 className="h-5 w-5 animate-spin text-sky-400" />
                      </div>
                    )}
                    <img
                      src={s.url}
                      alt={displayName}
                      loading="lazy"
                      onLoad={() => markImageLoaded(s.id)}
                      onError={() => markImageLoaded(s.id)}
                      className={`h-full w-full object-cover transition duration-300 group-hover:scale-105 ${
                        imageLoaded ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    
                    {/* Favorite heart overlay */}
                    {/* <button
                      type="button"
                      onClick={(e) => toggleFavorite(s.id, e)}
                      className={`absolute top-2 right-2 rounded-full border p-1.5 shadow-xs transition sm:p-1 ${
                        isFav
                          ? "bg-red-500 border-red-500 text-white"
                          : "bg-white/80 border-white/90 text-slate-500 hover:text-red-500 hover:bg-white"
                      }`}
                    >
                      <Heart className={`h-3.5 w-3.5 sm:h-3 sm:w-3 ${isFav ? "fill-current" : ""}`} />
                    </button> */}
                  </div>

                  {/* Details */}
                  <div className="p-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
                        Premium Stone
                      </span>
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">
                        {displayName}
                      </p>
                      <p className="mt-0.5 text-[9px] text-slate-400 truncate">
                        SKU: {s.sku || displayName}
                      </p>
                    </div>

                    <div className="mt-2 flex items-center text-[9px] font-semibold text-slate-500 group-hover:text-sky-600 transition">
                      <span>Details</span>
                      <ArrowRight className="ml-1 h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          // LIST VIEW
          <div className="space-y-2">
            {filteredStones.map((s) => {
              const isSelected = selectedStone === s.id;
              const isFav = !!favorites[s.id];
              const imageLoaded = !!loadedImages[s.id];
              const displayName = getDisplayStoneName(s.name);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedStone(s.id)}
                  className={`group relative flex w-full min-w-0 overflow-hidden rounded-xl border text-left transition-all duration-300 ${
                    isSelected
                      ? "border-sky-500 bg-sky-50/20 shadow-xs ring-1 ring-sky-500"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
                  }`}
                >
                  {/* Thumbnail Image */}
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden bg-slate-100">
                    {!imageLoaded && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100">
                        <Loader2 className="h-4 w-4 animate-spin text-sky-400" />
                      </div>
                    )}
                    <img
                      src={s.url}
                      alt={displayName}
                      loading="lazy"
                      onLoad={() => markImageLoaded(s.id)}
                      onError={() => markImageLoaded(s.id)}
                      className={`h-full w-full object-cover transition duration-300 group-hover:scale-105 ${
                        imageLoaded ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    
                    {/* Favorite heart overlay */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(s.id, e)}
                      className={`absolute top-1.5 right-1.5 rounded-full border p-1.5 shadow-xs transition sm:p-1 ${
                        isFav
                          ? "bg-red-500 border-red-500 text-white"
                          : "bg-white/80 border-white/90 text-slate-500 hover:text-red-500 hover:bg-white"
                      }`}
                    >
                      <Heart className={`h-3 w-3 sm:h-2.5 sm:w-2.5 ${isFav ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="p-3 flex-1 flex flex-col justify-between min-w-0">
                    <div className="truncate">
                      <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block">
                        Premium Stone
                      </span>
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {displayName}
                      </p>
                      <p className="text-[9px] text-slate-400 truncate mt-0.5">
                        SKU: {s.sku || displayName}
                      </p>
                    </div>

                    <div className="mt-1 flex items-center text-[9px] font-semibold text-slate-500 group-hover:text-sky-600 transition">
                      <span>More product details</span>
                      <ArrowRight className="ml-1 h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
