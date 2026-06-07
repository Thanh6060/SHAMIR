import React from "react";
import { Unlock, AlertCircle } from "lucide-react";
interface ReconstructFormProps {
  reconstructInput: string;
  setReconstructInput: (val: string) => void;
  reconstructError: string;
  handleReconstruct: () => void;
  thresholdK: number;
}
export default function ReconstructForm({
  reconstructInput,
  setReconstructInput,
  reconstructError,
  handleReconstruct,
  thresholdK,
}: ReconstructFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
          Dán Các Phần Chia Tại Đây
        </label>
        <p className="text-xs text-slate-500 mb-1.5 font-sans">
          Mỗi phần chia trên một dòng khác nhau (nhập tối thiểu bằng số Ngưỡng K
          đề ra)
        </p>
        <textarea
          value={reconstructInput}
          onChange={(e) => setReconstructInput(e.target.value)}
          placeholder="Ví dụ dán các dòng sau:&#10;1-d7f90e...&#10;3-a8f4c0...&#10;5-b3a12d..."
          rows={6}
          className="w-full text-xs p-3 font-mono border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-slate-50/50 resize-y"
          id="input_reconstruct_shares"
        />
      </div>
      {reconstructError && (
        <div className="flex items-start gap-2 text-xs py-2 px-3 bg-amber-50 text-amber-800 rounded-lg border border-amber-100 font-sans">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{reconstructError}</span>
        </div>
      )}
      <button
        onClick={handleReconstruct}
        className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
        id="btn_reconstruct"
      >
        <Unlock className="w-4 h-4" />
        Bắt Đầu Giải Mã Key
      </button>
    </div>
  );
}
