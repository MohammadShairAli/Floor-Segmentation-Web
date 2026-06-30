import PreviewStage from "./PreviewStage";

interface ResultPanelProps {
  result?: {
    result_url: string;
    stone: {
      id: string;
      name: string;
      url: string;
      sku?: string;
    };
  } | null;
  loading: boolean;
  preview: string | null;
  activeStone?: any;
  onDemoSelect?: (demo: any) => void;
  loadingDemo?: string | null;
}

export default function ResultPanel({
  result,
  loading,
  preview,
  activeStone,
  onDemoSelect,
  loadingDemo,
}: ResultPanelProps) {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-1 min-h-0">
        <PreviewStage
          originalImage={preview}
          resultImage={result?.result_url || null}
          loading={loading}
          activeStone={result ? result.stone : activeStone}
          onDemoSelect={onDemoSelect}
          loadingDemo={loadingDemo}
        />
      </div>
    </div>
  );
}