import React from "react";
import { Lock, AlertCircle } from "lucide-react";
interface SecretParamsFormProps {
  secretInput: string;
  setSecretInput: (val: string) => void;
  sharesN: number;
  setSharesN: (val: number) => void;
  thresholdK: number;
  setThresholdK: (val: number) => void;
  splitError: string;
  handleSplit: (e?: React.FormEvent) => void;
}
export default function SecretParamsForm({
  secretInput,
  setSecretInput,
  sharesN,
  setSharesN,
  thresholdK,
  setThresholdK,
  splitError,
  handleSplit,
}: SecretParamsFormProps) {
  return (
    <form onSubmit={handleSplit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Nội dung bí mật (Chuỗi văn bản bất kỳ)
        </label>
        <textarea
          value={secretInput}
          onChange={(e) => setSecretInput(e.target.value)}
          placeholder="Mật khẩu của bạn, khóa ví crypto, hoặc thông điệp bảo mật..."
          rows={3}
          className="w-full text-sm p-3 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-slate-50/50 resize-y font-sans"
          id="input_secret"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Tổng số phần (N)
          </label>
          <div className="text-xs text-slate-500 mb-1.5 font-sans">
            Chia thành bao nhiêu phần
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="2"
              max="20"
              value={sharesN}
              onChange={(e) => setSharesN(parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
              id="range_n"
            />
            <span className="text-sm font-extrabold text-blue-700 bg-blue-100/80 px-2.5 py-1 rounded-md min-w-[32px] text-center">
              {sharesN}
            </span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Ngưỡng tối thiểu (K)
          </label>
          <div className="text-xs text-slate-500 mb-1.5 font-sans">
            Mức tối thiểu để khôi phục
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="2"
              max={sharesN}
              value={thresholdK}
              onChange={(e) => setThresholdK(parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
              id="range_k"
            />
            <span className="text-sm font-extrabold text-blue-700 bg-blue-100/80 px-2.5 py-1 rounded-md min-w-[32px] text-center">
              {thresholdK}
            </span>
          </div>
        </div>
      </div>
      <div className="text-xs bg-slate-50 rounded-lg p-2.5 border border-slate-100 text-slate-600 font-sans">
        ⚡ Bạn đang thiết lập cơ chế{" "}
        <strong>
          ({thresholdK}-trong-{sharesN})
        </strong>
        . Cần ít nhất <strong>{thresholdK}</strong> phần chia bất kỳ để mở khóa
        bí mật này. Đạt được 1 hoặc 2 phần chia sẽ vô ích.
      </div>
      {splitError && (
        <div className="flex items-start gap-2 text-xs py-2 px-3 bg-red-50 text-red-700 rounded-lg border border-red-100 animate-pulse font-sans">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{splitError}</span>
        </div>
      )}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
        id="btn_generate_shares"
      >
        <Lock className="w-4 h-4" />
        Phân Tách Bí Mật Ngay
      </button>
    </form>
  );
}
