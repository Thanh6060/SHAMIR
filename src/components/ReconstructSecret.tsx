import React from "react";
import { Unlock } from "lucide-react";
import ReconstructForm from "./ReconstructForm";
import ReconstructedOutput from "./ReconstructedOutput";
interface ReconstructSecretSectionProps {
  reconstructInput: string;
  setReconstructInput: (val: string) => void;
  reconstructedResult: string;
  reconstructError: string;
  handleReconstruct: () => void;
  handleCopyResult: () => void;
  copiedResult: boolean;
  activeTab: "split" | "reconstruct";
  thresholdK: number;
}
export default function ReconstructSecretSection({
  reconstructInput,
  setReconstructInput,
  reconstructedResult,
  reconstructError,
  handleReconstruct,
  handleCopyResult,
  copiedResult,
  activeTab,
  thresholdK,
}: ReconstructSecretSectionProps) {
  return (
    <section
      className={`bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col justify-between ${
        activeTab === "reconstruct" ? "block" : "hidden sm:flex"
      }`}
      id="section_reconstruct"
    >
      <div>
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <Unlock className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900 font-sans">
            2. Khôi Phục Bí Mật Ban Đầu
          </h2>
        </div>
        <ReconstructForm
          reconstructInput={reconstructInput}
          setReconstructInput={setReconstructInput}
          reconstructError={reconstructError}
          handleReconstruct={handleReconstruct}
          thresholdK={thresholdK}
        />
      </div>
      <ReconstructedOutput
        reconstructedResult={reconstructedResult}
        handleCopyResult={handleCopyResult}
        copiedResult={copiedResult}
      />
    </section>
  );
}
