import React from "react";
import { Key, Sparkles, RotateCcw } from "lucide-react";

interface HeaderProps {
  onLoadDemo: () => void;
  onResetAll: () => void;
}

export default function Header({ onLoadDemo, onResetAll }: HeaderProps) {
  return (
    <header
      className="bg-white border-b border-slate-200 py-5 px-6 sticky top-0 z-10"
      id="app_header"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2.5 rounded-xl">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-950 tracking-tight flex items-center gap-2">
              Shamir's Secret Sharing
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                GF(256)
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Phân tách & khôi phục mã khóa bằng phương pháp mật mã học Shamir
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onLoadDemo}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
            title="Điền dữ liệu mẫu"
            id="btn_load_demo"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Chạy Demo Nhanh
          </button>
          <button
            onClick={onResetAll}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Đặt lại toàn bộ"
            id="btn_reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Xóa Hết
          </button>
        </div>
      </div>
    </header>
  );
}
