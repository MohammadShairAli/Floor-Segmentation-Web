import { useState, useRef } from "react";
import {
  Check,
  Image as ImageIcon,
  Loader2,
  Trash2,
  UploadCloud,
} from "lucide-react";

const DEMO_IMAGES = [
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

interface UploadPanelProps {
  setImageFile: (file: File | null) => void;
  setImagePreview: (url: string) => void;
  imagePreview?: string;
  imageFile?: File | null;
  onClearImage?: () => void;
}

export default function UploadPanel({
  setImageFile,
  setImagePreview,
  imagePreview,
  imageFile,
  onClearImage,
}: UploadPanelProps) {
  const [dragActive, setDragActive] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState<string | null>(null);
  const [demoError, setDemoError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const selectImage = (file: File, preview: string) => {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(preview);
    setDemoError("");
    onClearImage?.();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      selectImage(file, URL.createObjectURL(file));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      selectImage(file, URL.createObjectURL(file));
    }
  };

  const handleDemoSelect = async (demo: (typeof DEMO_IMAGES)[number]) => {
    setLoadingDemo(demo.src);
    setDemoError("");

    try {
      const response = await fetch(demo.src);

      if (!response.ok) {
        throw new Error(`Unable to load ${demo.fileName}`);
      }

      const blob = await response.blob();
      const file = new File([blob], demo.fileName, {
        type: blob.type || "image/jpeg",
      });

      selectImage(file, demo.src);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (error) {
      console.error("Failed to load demo image:", error);
      setDemoError("Could not load that demo. Please try another image.");
    } finally {
      setLoadingDemo(null);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const handleDeleteImage = () => {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview("");
    onClearImage?.();

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="glass-panel w-full min-w-0 max-w-full rounded-xl p-4 transition-all duration-300 hover:shadow-md sm:rounded-2xl sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-bold tracking-wide text-slate-700 uppercase">
          Room Photo
        </h3>
        {imageFile && (
          <button
            type="button"
            onClick={handleDeleteImage}
            className="flex items-center gap-1 rounded-full border border-red-100 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 transition hover:border-red-200 hover:bg-red-100 hover:text-red-700"
            title="Delete uploaded photo"
            aria-label="Delete uploaded photo"
          >
            <Trash2 className="h-3 w-3" />
            Delete
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
      />

      {!imagePreview ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 text-center transition-all duration-200 sm:p-6 ${
            dragActive
              ? "border-sky-500 bg-sky-50/50 scale-[0.99]"
              : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <div className="mb-3 rounded-full bg-white p-3 shadow-xs border border-slate-100">
            <UploadCloud className="h-6 w-6 text-slate-500" />
          </div>
          <p className="text-sm font-semibold text-slate-700">
            Upload your room photo
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Drag and drop or click to browse
          </p>
        </div>
      ) : (
        <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-900">
          <img
            src={imagePreview}
            alt="Room Preview"
            className="h-40 w-full object-cover opacity-85 transition duration-300 group-hover:scale-105 sm:h-36 lg:h-32"
          />
          <div className="absolute inset-0 flex flex-col justify-between p-3 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent">
            {/* <div className="flex justify-end">
              <button
                type="button"
                onClick={onButtonClick}
                className="rounded-full bg-white/95 p-1.5 shadow-sm text-slate-700 hover:text-slate-900 hover:bg-white transition"
                title="Change image"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div> */}
            <div className="flex items-center gap-2 text-white">
              <ImageIcon className="h-4 w-4 shrink-0 text-sky-400" />
              <p className="truncate text-xs font-medium max-w-[85%]">
                {imageFile?.name || "Uploaded Room"}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 border-t border-slate-100 pt-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            Try a demo
          </p>
          <span className="text-[10px] text-slate-400">Select a sample photo</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {DEMO_IMAGES.map((demo) => {
            const isSelected = imagePreview === demo.src;
            const isLoading = loadingDemo === demo.src;

            return (
              <button
                key={demo.src}
                type="button"
                onClick={() => handleDemoSelect(demo)}
                disabled={loadingDemo !== null}
                aria-label={`Use ${demo.label} demo image`}
                aria-pressed={isSelected}
                className={`group/demo relative aspect-[4/3] overflow-hidden rounded-lg border bg-slate-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70 ${
                  isSelected
                    ? "border-sky-500 ring-2 ring-sky-500 ring-offset-1"
                    : "border-slate-200 hover:border-sky-400"
                }`}
              >
                <img
                  src={demo.src}
                  alt=""
                  className="h-full w-full object-cover transition duration-300 group-hover/demo:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-slate-950/90 to-transparent px-1 pb-1 pt-3 text-left text-[9px] font-semibold text-white">
                  {demo.label}
                </span>
                {isLoading && (
                  <span className="absolute inset-0 flex items-center justify-center bg-slate-950/55 text-white">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </span>
                )}
                {isSelected && !isLoading && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-white shadow-sm">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {demoError && (
          <p className="mt-2 text-[10px] font-medium text-red-600" role="alert">
            {demoError}
          </p>
        )}
      </div>
    </div>
  );
}
