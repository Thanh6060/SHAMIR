import React from "react";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

interface ChartControlsProps {
  chartZoom: number;
  chartCenterX: number | null;
  chartCenterY: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handlePanUp: () => void;
  handlePanDown: () => void;
  handlePanLeft: () => void;
  handlePanRight: () => void;
  handleResetZoom: () => void;
}

export default function ChartControls({
  chartZoom,
  chartCenterX,
  chartCenterY,
  handleZoomIn,
  handleZoomOut,
  handlePanUp,
  handlePanDown,
  handlePanLeft,
  handlePanRight,
  handleResetZoom,
}: ChartControlsProps) {
  const isModified =
    chartZoom !== 1.0 || chartCenterX !== null || chartCenterY !== 127.5;

  return (
    <div className="absolute top-3 right-3 flex flex-row items-center gap-2 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-200/80 shadow-xs z-20">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden lg:inline select-none font-sans">
        Thu nhỏ/Phóng to:
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleZoomIn}
          className="p-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          title="Phóng To (Zoom In)"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          title="Thu Nhỏ (Zoom Out)"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 min-w-[36px] text-center select-none">
          {Math.round(chartZoom * 100)}%
        </span>
      </div>

      <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden lg:inline select-none font-sans">
        Di chuyển:
      </span>
      <div className="grid grid-cols-3 gap-0.5 w-[66px] h-[44px] relative scale-90 sm:scale-100">
        <div></div>
        <button
          type="button"
          onClick={handlePanUp}
          className="p-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 transition-colors flex items-center justify-center text-[10px] cursor-pointer"
          title="Lên trên"
        >
          ▲
        </button>
        <div></div>
        <button
          type="button"
          onClick={handlePanLeft}
          className="p-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 transition-colors flex items-center justify-center text-[10px] cursor-pointer"
          title="Sang trái"
        >
          ◀
        </button>
        <button
          type="button"
          onClick={handleResetZoom}
          className="p-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center justify-center text-[9px] font-extrabold cursor-pointer"
          title="Trở lại xem mặc định"
        >
          M
        </button>
        <button
          type="button"
          onClick={handlePanRight}
          className="p-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 transition-colors flex items-center justify-center text-[10px] cursor-pointer"
          title="Sang phải"
        >
          ▶
        </button>
        <div></div>
        <button
          type="button"
          onClick={handlePanDown}
          className="p-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 transition-colors flex items-center justify-center text-[10px] cursor-pointer"
          title="Xuống dưới"
        >
          ▼
        </button>
        <div></div>
      </div>

      {isModified && (
        <button
          type="button"
          onClick={handleResetZoom}
          className="text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg border border-blue-200 transition-colors flex items-center gap-1 cursor-pointer font-sans"
        >
          <Maximize2 className="w-3 h-3" />
          Reset
        </button>
      )}
    </div>
  );
}
