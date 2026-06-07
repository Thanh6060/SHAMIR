import React, { useState, useEffect } from "react";
import { splitSecret, reconstructSecret } from "./utils/shamir";
import Header from "./components/Header";
import SplitSecretSection from "./components/SplitSecretSection";
import ReconstructSecretSection from "./components/ReconstructSecret";
import LagrangeChart from "./components/LagrangeChart";
export default function App() {
  const [secretInput, setSecretInput] = useState("");
  const [sharesN, setSharesN] = useState(5);
  const [thresholdK, setThresholdK] = useState(3);
  const [generatedShares, setGeneratedShares] = useState<string[]>([]);
  const [copiedShareIndex, setCopiedShareIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [splitError, setSplitError] = useState("");
  const [reconstructInput, setReconstructInput] = useState("");
  const [reconstructedResult, setReconstructedResult] = useState("");
  const [reconstructError, setReconstructError] = useState("");
  const [copiedResult, setCopiedResult] = useState(false);
  const [activeTab, setActiveTab] = useState<"split" | "reconstruct">("split");
  useEffect(() => {
    if (sharesN < thresholdK) {
      setThresholdK(sharesN);
    }
  }, [sharesN, thresholdK]);
  const handleSplit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSplitError("");
    setCopiedAll(false);
    if (!secretInput.trim()) {
      setSplitError("Vui lòng nhập nội dung bí mật cần chia.");
      return;
    }
    try {
      const shares = splitSecret(secretInput, sharesN, thresholdK);
      setGeneratedShares(shares);
    } catch (err: any) {
      setSplitError(err.message || "Đã xảy ra lỗi khi tạo các phần chia.");
    }
  };
  const handleReconstruct = () => {
    setReconstructError("");
    setReconstructedResult("");
    const lines = reconstructInput
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    if (lines.length === 0) {
      setReconstructError(
        "Vui lòng nhập hoặc dán ít nhất " +
          thresholdK +
          " phần chia (mỗi phần một dòng).",
      );
      return;
    }
    try {
      const result = reconstructSecret(lines);
      setReconstructedResult(result);
    } catch (err: any) {
      setReconstructError(
        err.message || "Dữ liệu phần chia không hợp lệ hoặc không đủ số lượng.",
      );
    }
  };
  useEffect(() => {
    const lines = reconstructInput
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    if (lines.length > 0) {
      try {
        const result = reconstructSecret(lines);
        setReconstructedResult(result);
        setReconstructError("");
      } catch (err: any) {
        setReconstructedResult("");
        setReconstructError(err.message);
      }
    } else {
      setReconstructedResult("");
      setReconstructError("");
    }
  }, [reconstructInput]);
  const loadDemo = () => {
    const demoSecret = "Mật-Thư-Tuyệt-Mật-2026-🔑";
    setSecretInput(demoSecret);
    setSharesN(5);
    setThresholdK(3);
    try {
      const shares = splitSecret(demoSecret, 5, 3);
      setGeneratedShares(shares);
      setSplitError("");
      const selectedShares = [shares[0], shares[2], shares[4]].join("\n");
      setReconstructInput(selectedShares);
    } catch (err: any) {
      setSplitError(err.message);
    }
  };
  const copyToClipboard = (text: string, onCopySuccess: () => void) => {
    navigator.clipboard.writeText(text).then(() => {
      onCopySuccess();
    });
  };
  const handleCopySingleShare = (share: string, index: number) => {
    copyToClipboard(share, () => {
      setCopiedShareIndex(index);
      setTimeout(() => setCopiedShareIndex(null), 1500);
    });
  };
  const handleCopyAllShares = () => {
    const textToCopy = generatedShares.join("\n");
    copyToClipboard(textToCopy, () => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1500);
    });
  };
  const handleCopyResult = () => {
    copyToClipboard(reconstructedResult, () => {
      setCopiedResult(true);
      setTimeout(() => setCopiedResult(false), 1500);
    });
  };
  const resetAll = () => {
    setSecretInput("");
    setSharesN(5);
    setThresholdK(3);
    setGeneratedShares([]);
    setSplitError("");
    setReconstructInput("");
    setReconstructedResult("");
    setReconstructError("");
  };
  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans"
      id="app_root"
    >
      <Header onLoadDemo={loadDemo} onResetAll={resetAll} />
      <main
        className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6"
        id="app_main"
      >
        <div
          className="flex sm:hidden bg-slate-200 p-1.5 rounded-lg mb-4"
          id="mobile_tab_bar"
        >
          <button
            onClick={() => setActiveTab("split")}
            className={`flex-1 text-center py-2 text-xs font-semibold rounded-md transition-colors ${
              activeTab === "split"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600"
            }`}
          >
            1. Chia Bí Mật
          </button>
          <button
            onClick={() => setActiveTab("reconstruct")}
            className={`flex-1 text-center py-2 text-xs font-semibold rounded-md transition-colors ${
              activeTab === "reconstruct"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600"
            }`}
          >
            2. Khôi Phục
          </button>
        </div>
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          id="dashboard_grid"
        >
          <SplitSecretSection
            secretInput={secretInput}
            setSecretInput={setSecretInput}
            sharesN={sharesN}
            setSharesN={setSharesN}
            thresholdK={thresholdK}
            setThresholdK={setThresholdK}
            generatedShares={generatedShares}
            splitError={splitError}
            handleSplit={handleSplit}
            handleCopySingleShare={handleCopySingleShare}
            handleCopyAllShares={handleCopyAllShares}
            copiedShareIndex={copiedShareIndex}
            copiedAll={copiedAll}
            activeTab={activeTab}
          />
          <ReconstructSecretSection
            reconstructInput={reconstructInput}
            setReconstructInput={setReconstructInput}
            reconstructedResult={reconstructedResult}
            reconstructError={reconstructError}
            handleReconstruct={handleReconstruct}
            handleCopyResult={handleCopyResult}
            copiedResult={copiedResult}
            activeTab={activeTab}
            thresholdK={thresholdK}
          />
        </div>
        <LagrangeChart
          generatedShares={generatedShares}
          reconstructInput={reconstructInput}
          sharesN={sharesN}
          thresholdK={thresholdK}
          secretInput={secretInput}
          reconstructedResult={reconstructedResult}
        />
      </main>
    </div>
  );
}
