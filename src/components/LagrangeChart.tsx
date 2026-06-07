import React, { useState, useEffect, useRef } from "react";
import { interpolateReal } from "../utils/math";
import ChartControls from "./ChartControls";

interface LagrangeChartProps {
  generatedShares: string[];
  reconstructInput: string;
  sharesN: number;
  thresholdK: number;
  secretInput: string;
  reconstructedResult: string;
}

export default function LagrangeChart({
  generatedShares,
  reconstructInput,
  sharesN,
  thresholdK,
  secretInput,
  reconstructedResult,
}: LagrangeChartProps) {
  const [chartZoom, setChartZoom] = useState(1.0);
  const [chartCenterX, setChartCenterX] = useState<number | null>(null);
  const [chartCenterY, setChartCenterY] = useState(127.5);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });

  const chartRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setChartZoom((z) => Math.min(z * 1.3, 15));
  };
  const handleZoomOut = () => {
    setChartZoom((z) => Math.max(z / 1.3, 1.0));
  };
  const handlePanLeft = () => {
    setChartCenterX((cx) => {
      const currentCX = cx !== null ? cx : 5 / 2;
      return Math.max(-10, currentCX - 1.5 / chartZoom);
    });
  };
  const handlePanRight = () => {
    setChartCenterX((cx) => {
      const currentCX = cx !== null ? cx : 5 / 2;
      return Math.min(40, currentCX + 1.5 / chartZoom);
    });
  };
  const handlePanUp = () => {
    setChartCenterY((cy) => Math.min(400, cy + 40 / chartZoom));
  };
  const handlePanDown = () => {
    setChartCenterY((cy) => Math.max(-150, cy - 40 / chartZoom));
  };
  const handleResetZoom = () => {
    setChartZoom(1.0);
    setChartCenterX(null);
    setChartCenterY(127.5);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  useEffect(() => {
    setChartZoom(1.0);
    setChartCenterX(null);
    setChartCenterY(127.5);
  }, [generatedShares, reconstructInput]);
  useEffect(() => {
    const element = chartRef.current;
    if (!element) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        setChartZoom((z) => Math.min(z * 1.15, 15));
      } else {
        setChartZoom((z) => Math.max(z / 1.15, 1.0));
      }
    };

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      element.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // 1. Parse generated points
  const pts = generatedShares.map((share) => {
    const parts = share.split("-");
    const x = parseInt(parts[0], 10);
    const hex = parts[1] || "";
    const y = hex.length >= 2 ? parseInt(hex.substring(0, 2), 16) : 0;
    return { x, y };
  });

  // 2. Parse active reconstruction points
  const actLines = reconstructInput
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const actPts = actLines
    .map((line) => {
      const parts = line.split("-");
      if (parts.length === 2) {
        const x = parseInt(parts[0], 10);
        const hex = parts[1] || "";
        const y = hex.length >= 2 ? parseInt(hex.substring(0, 2), 16) : 0;
        if (!isNaN(x) && !isNaN(y)) {
          return { x, y };
        }
      }
      return null;
    })
    .filter((p): p is { x: number; y: number } => p !== null);

  // 3. Original secret char byte
  let originByte = null;
  if (secretInput) {
    try {
      const bytes = new TextEncoder().encode(secretInput);
      if (bytes.length > 0) originByte = bytes[0];
    } catch (e) {}
  }
  if (originByte === null && reconstructedResult) {
    try {
      const bytes = new TextEncoder().encode(reconstructedResult);
      if (bytes.length > 0) originByte = bytes[0];
    } catch (e) {}
  }

  const padL = 50;
  const padR = 25;
  const padT = 25;
  const padB = 30;
  const w = 800;
  const h = 280;
  const pW = w - padL - padR;
  const pH = h - padT - padB;

  const defaultMaxX =
    Math.max(sharesN, ...pts.map((p) => p.x), ...actPts.map((p) => p.x), 5) +
    0.5;
  const centerX = chartCenterX !== null ? chartCenterX : defaultMaxX / 2;
  const centerY = chartCenterY;
  const halfSpanX = defaultMaxX / 2 / chartZoom;
  const halfSpanY = 255 / 2 / chartZoom;

  const viewMinX = centerX - halfSpanX;
  const viewMaxX = centerX + halfSpanX;
  const viewMinY = centerY - halfSpanY;
  const viewMaxY = centerY + halfSpanY;

  const getX = (xVal: number) =>
    padL + ((xVal - viewMinX) / (viewMaxX - viewMinX)) * pW;
  const getY = (yVal: number) =>
    padT + pH - ((yVal - viewMinY) / (viewMaxY - viewMinY)) * pH;
  const curvePts =
    actPts.length >= 2
      ? [...actPts].sort((a, b) => a.x - b.x)
      : pts.length >= 2
        ? [...pts].sort((a, b) => a.x - b.x).slice(0, thresholdK)
        : [];

  let curveD = "";
  if (curvePts.length >= 2) {
    const steps = 180;
    const coords: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const xVal = viewMinX + (i / steps) * (viewMaxX - viewMinX);
      const yVal = interpolateReal(curvePts, xVal);
      if (!isNaN(yVal)) {
        const sx = getX(xVal);
        const sy = getY(yVal);
        coords.push(`${i === 0 ? "M" : "L"} ${sx} ${sy}`);
      }
    }
    curveD = coords.join(" ");
  }

  return (
    <section
      className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 mt-6"
      id="section_reconstruction_chart"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2 font-sans">
            <span className="text-xl">📈</span> Biểu Đồ Nội Suy Lagrange Thúc
            Đẩy SSS
          </h2>
          <p className="text-xs text-slate-500">
            Trực quan hóa thuật toán đối xứng bằng đa thức Lagrange của Byte đầu
            tiên qua các điểm tọa độ
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-sans">
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-md text-slate-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-600 block"></span>
            Điểm đã tạo ({generatedShares.length})
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 rounded-md text-emerald-800 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>
            Điểm kích hoạt ({actLines.length})
          </span>
          {originByte !== null && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 rounded-md text-amber-800 font-medium">
              <span
                className="w-2 h-2 bg-amber-500 block"
                style={{
                  clipPath:
                    "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                }}
              ></span>
              Khóa gốc P(0) = {originByte} ('
              {String.fromCharCode(originByte).replace(
                /[\x00-\x1F\x7F-\x9F]/g,
                "?",
              )}
              ')
            </span>
          )}
        </div>
      </div>

      <div
        className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-5 relative overflow-hidden select-none cursor-grab active:cursor-grabbing hover:shadow-xs transition-shadow"
        id="chart_container"
        ref={chartRef}
        onMouseDown={handleMouseDown}
        onMouseMove={(e) => {
          if (!isDragging) return;
          const dx = e.clientX - dragStart.x;
          const dy = e.clientY - dragStart.y;
          setDragStart({ x: e.clientX, y: e.clientY });

          const xSpan = viewMaxX - viewMinX;
          const ySpan = viewMaxY - viewMinY;

          const deltaX = (dx / pW) * xSpan;
          const deltaY = (dy / pH) * ySpan;

          setChartCenterX((cx) => {
            const currentCX = cx !== null ? cx : defaultMaxX / 2;
            return Math.max(
              -10,
              Math.min(currentCX - deltaX, defaultMaxX + 10),
            );
          });
          setChartCenterY((cy) => Math.max(-150, Math.min(cy + deltaY, 400)));
        }}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={(e) => {
          if (e.touches.length === 1) {
            setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
          }
        }}
        onTouchMove={(e) => {
          if (e.touches.length === 1) {
            const dx = e.touches[0].clientX - touchStart.x;
            const dy = e.touches[0].clientY - touchStart.y;
            setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });

            const xSpan = viewMaxX - viewMinX;
            const ySpan = viewMaxY - viewMinY;

            const deltaX = (dx / pW) * xSpan;
            const deltaY = (dy / pH) * ySpan;

            setChartCenterX((cx) => {
              const currentCX = cx !== null ? cx : defaultMaxX / 2;
              return Math.max(
                -10,
                Math.min(currentCX - deltaX, defaultMaxX + 10),
              );
            });
            setChartCenterY((cy) => Math.max(-150, Math.min(cy + deltaY, 400)));
          }
        }}
        onTouchEnd={handleMouseUp}
      >
        <ChartControls
          chartZoom={chartZoom}
          chartCenterX={chartCenterX}
          chartCenterY={chartCenterY}
          handleZoomIn={handleZoomIn}
          handleZoomOut={handleZoomOut}
          handlePanUp={handlePanUp}
          handlePanDown={handlePanDown}
          handlePanLeft={handlePanLeft}
          handlePanRight={handlePanRight}
          handleResetZoom={handleResetZoom}
        />

        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${w} ${h}`}
            className="w-full min-w-[650px] h-auto overflow-visible select-none"
          >
            <defs>
              <clipPath id="chart-area-clip">
                <rect x={padL} y={padT} width={pW} height={pH} />
              </clipPath>
            </defs>

            {/* Horizontal Y axes grid */}
            {(() => {
              const yTicksDefault = [0, 50, 100, 150, 200, 255];
              const yTicks =
                chartZoom > 2.5
                  ? Array.from({ length: 26 }).map((_, i) => i * 10)
                  : yTicksDefault;

              return yTicks.map((yV) => {
                const yPos = getY(yV);
                if (yPos < padT || yPos > padT + pH) return null;
                return (
                  <g key={yV}>
                    <line
                      x1={padL}
                      y1={yPos}
                      x2={w - padR}
                      y2={yPos}
                      stroke="#e2e8f0"
                      strokeWidth="1"
                      strokeDasharray={yV === 0 || yV === 255 ? "0" : "4 4"}
                    />
                    <text
                      x={padL - 8}
                      y={yPos + 4}
                      textAnchor="end"
                      className="text-[10px] font-mono fill-slate-400 font-bold"
                    >
                      {yV}
                    </text>
                  </g>
                );
              });
            })()}

            {/* Vertical X axes grid */}
            {(() => {
              const xStart = Math.max(0, Math.floor(viewMinX) - 1);
              const xEnd = Math.ceil(viewMaxX) + 1;
              const ticks = [];
              for (let i = xStart; i <= xEnd; i++) {
                ticks.push(i);
              }
              return ticks.map((idx) => {
                const xPos = getX(idx);
                if (xPos < padL || xPos > w - padR) return null;
                return (
                  <g key={idx}>
                    <line
                      x1={xPos}
                      y1={padT}
                      x2={xPos}
                      y2={padT + pH}
                      stroke="#e2e8f0"
                      strokeWidth="1"
                      strokeDasharray={idx === 0 ? "0" : "4 4"}
                    />
                    <text
                      x={xPos}
                      y={padT + pH + 15}
                      textAnchor="middle"
                      className={`text-[10px] font-mono font-bold ${idx === 0 ? "fill-amber-600 font-extrabold" : "fill-slate-400"}`}
                    >
                      {idx === 0 ? "X = 0" : `X = ${idx}`}
                    </text>
                  </g>
                );
              });
            })()}
            {curveD && (
              <path
                d={curveD}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                clipPath="url(#chart-area-clip)"
                className="opacity-90 stroke-linecap-round"
              />
            )}
            {pts.map((pt) => {
              const cx = getX(pt.x);
              const cy = getY(pt.y);
              if (cx < padL || cx > w - padR || cy < padT || cy > padT + pH)
                return null;
              const isActive = actPts.some((ap) => ap.x === pt.x);
              return (
                <g key={`sh-${pt.x}`}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r="6"
                    className={`${
                      isActive
                        ? "fill-emerald-500 stroke-white"
                        : "fill-white stroke-blue-500"
                    } stroke-2 cursor-pointer transition-all hover:scale-125`}
                  />
                  <text
                    x={cx}
                    y={cy - 10}
                    textAnchor="middle"
                    className="text-[9px] font-mono fill-slate-500 font-bold"
                  >
                    ({pt.x}, {pt.y})
                  </text>
                </g>
              );
            })}
            {actPts.map((pt) => {
              const cx = getX(pt.x);
              const cy = getY(pt.y);
              if (cx < padL || cx > w - padR || cy < padT || cy > padT + pH)
                return null;
              return (
                <g key={`act-${pt.x}`}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r="11"
                    className="fill-emerald-400/20 stroke-emerald-500/30 stroke-1"
                  />
                  <circle
                    cx={cx}
                    cy={cy}
                    r="6"
                    className="fill-emerald-500 stroke-white stroke-2 cursor-pointer"
                  />
                  <text
                    x={cx}
                    y={cy - 12}
                    textAnchor="middle"
                    className="text-[9px] font-mono fill-emerald-800 font-bold"
                  >
                    Kích hoạt
                  </text>
                </g>
              );
            })}
            {originByte !== null &&
              (() => {
                const cx = getX(0);
                const cy = getY(originByte);
                if (cx < padL || cx > w - padR || cy < padT || cy > padT + pH)
                  return null;
                return (
                  <g>
                    <circle
                      cx={cx}
                      cy={cy}
                      r="14"
                      className="fill-amber-400/25 stroke-amber-500/30 stroke-1"
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r="6.5"
                      className="fill-amber-500 stroke-white stroke-2 cursor-pointer"
                    />
                    <text
                      x={cx + 12}
                      y={cy + 3}
                      className="text-[10px] font-extrabold fill-amber-700 select-none bg-white py-0.5 px-1 rounded"
                    >
                      Bí mật P(0) = {originByte}
                    </text>
                  </g>
                );
              })()}
          </svg>
        </div>
        <div className="mt-3 text-[11px] text-slate-500 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 font-sans">
          <span className="flex items-center gap-1 text-slate-600">
            <span>💡</span>
            <span className="font-semibold text-blue-700 bg-blue-50 px-1.5 rounded">
              Mẹo:
            </span>
            <span>
              Kéo chuột / vuốt để di chuyển. Cuộn chuột để Thu nhỏ / Phóng to
              biểu đồ.
            </span>
          </span>
          <span className="text-slate-400 text-[10px] font-mono">
            Trục Y: [0, 255] | Trục X: [Thứ tự phần chia]
          </span>
        </div>
      </div>
    </section>
  );
}
