import React from "react";
import { Lock } from "lucide-react";
import SecretParamsForm from "./SecretParamsForm";
import SharesList from "./SharesList";
interface SplitSecretSectionProps {
  secretInput: string;
  setSecretInput: (val: string) => void;
  sharesN: number;
  setSharesN: (val: number) => void;
  thresholdK: number;
  setThresholdK: (val: number) => void;
  generatedShares: string[];
  splitError: string;
  handleSplit: (e?: React.FormEvent) => void;
  handleCopySingleShare: (share: string, index: number) => void;
  handleCopyAllShares: () => void;
  copiedShareIndex: number | null;
  copiedAll: boolean;
  activeTab: "split" | "reconstruct";
}
export default function SplitSecretSection({
  secretInput,
  setSecretInput,
  sharesN,
  setSharesN,
  thresholdK,
  setThresholdK,
  generatedShares,
  splitError,
  handleSplit,
  handleCopySingleShare,
  handleCopyAllShares,
  copiedShareIndex,
  copiedAll,
  activeTab,
}: SplitSecretSectionProps) {
  return (
    <section
      className={`bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col justify-between ${
        activeTab === "split" ? "block" : "hidden sm:flex"
      }`}
      id="section_split"
    >
      <div>
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <Lock className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900">
            1. Tạo Phần Chia Mới
          </h2>
        </div>

        <SecretParamsForm
          secretInput={secretInput}
          setSecretInput={setSecretInput}
          sharesN={sharesN}
          setSharesN={setSharesN}
          thresholdK={thresholdK}
          setThresholdK={setThresholdK}
          splitError={splitError}
          handleSplit={handleSplit}
        />
      </div>
      <SharesList
        generatedShares={generatedShares}
        handleCopyAllShares={handleCopyAllShares}
        handleCopySingleShare={handleCopySingleShare}
        copiedShareIndex={copiedShareIndex}
        copiedAll={copiedAll}
        thresholdK={thresholdK}
      />
    </section>
  );
}
