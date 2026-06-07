import React from "react";
import { ClipboardList, Check, Copy, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
interface SharesListProps {
  generatedShares: string[];
  handleCopyAllShares: () => void;
  handleCopySingleShare: (share: string, index: number) => void;
  copiedShareIndex: number | null;
  copiedAll: boolean;
  thresholdK: number;
}
export default function SharesList({
  generatedShares,
  handleCopyAllShares,
  handleCopySingleShare,
  copiedShareIndex,
  copiedAll,
  thresholdK,
}: SharesListProps) {
  if (generatedShares.length === 0) return null;
  return (
    <div
      className="mt-6 pt-5 border-t border-slate-100 animate-fade-in"
      id="shares_output_container"
    >
      <div className="flex items-center justify-between mb-3 font-sans">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4.5 h-4.5 text-blue-600" />
          <h3 className="font-bold text-sm text-slate-900">
            Danh Sách Các Phần Chia:
          </h3>
        </div>
        <button
          onClick={handleCopyAllShares}
          className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
          id="btn_copy_all"
        >
          {copiedAll ? (
            <Check className="w-3 h-3 text-emerald-600" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
          {copiedAll ? "Đã chép tất cả!" : "Sao chép toàn bộ"}
        </button>
      </div>
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {generatedShares.map((share, index) => {
            const [x] = share.split("-");
            return (
              <motion.div
                key={share}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-blue-200 transition-all text-xs font-mono"
              >
                <div className="flex items-center gap-2 overflow-hidden mr-2">
                  <span className="bg-blue-600 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase shrink-0">
                    Phần {x}
                  </span>
                  <span
                    className="truncate text-slate-600 select-all"
                    title={share}
                  >
                    {share}
                  </span>
                </div>
                <button
                  onClick={() => handleCopySingleShare(share, index)}
                  className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors shrink-0 cursor-pointer"
                  title="Sao chép phần chia này"
                >
                  {copiedShareIndex === index ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <div className="mt-3 text-[11px] bg-amber-50 text-amber-800 p-2.5 rounded-lg border border-amber-100 flex gap-1.5 font-sans">
        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <span>
          Dùng bất kỳ <strong>{thresholdK}</strong> phần khác nhau nào ở trên để
          dán vào khung khôi phục bên phải để kiểm tra!
        </span>
      </div>
    </div>
  );
}
