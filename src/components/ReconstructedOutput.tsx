import React from "react";
import { CheckCircle2, Check, Copy } from "lucide-react";

interface ReconstructedOutputProps {
  reconstructedResult: string;
  handleCopyResult: () => void;
  copiedResult: boolean;
}

export default function ReconstructedOutput({
  reconstructedResult,
  handleCopyResult,
  copiedResult,
}: ReconstructedOutputProps) {
  if (!reconstructedResult) return null;

  return (
    <div
      className="mt-6 pt-5 border-t border-slate-100 bg-emerald-50/40 p-4 rounded-xl border border-emerald-100/50 animate-fade-in"
      id="reconstruct_output_container"
    >
      <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-2 uppercase tracking-wide font-sans">
        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
        Mở Khóa Thành Công!
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-3.5 flex items-center justify-between gap-2 overflow-hidden">
        <div className="overflow-hidden mr-2 font-sans">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">
            Bí mật nguyên bản là:
          </div>
          <div
            className="text-sm font-mono text-slate-950 font-bold select-all break-all"
            id="output_reconstructed_secret"
          >
            {reconstructedResult}
          </div>
        </div>
        <button
          onClick={handleCopyResult}
          className="p-2 text-slate-500 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-100 rounded-lg border border-slate-200 transition-colors shrink-0 cursor-pointer"
          title="Sao chép kết quả này"
          id="btn_copy_result"
        >
          {copiedResult ? (
            <Check className="w-4 h-4 text-emerald-600" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
