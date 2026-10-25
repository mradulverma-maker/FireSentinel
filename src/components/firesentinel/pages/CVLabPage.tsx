"use client";
import { useState, useRef, useEffect } from "react";
import { Eye, Layers, SlidersHorizontal, RotateCcw, Info, AlertTriangle } from "lucide-react";

type ViewMode = "original" | "segmentation" | "perimeter" | "comparison";

export function CVLabPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("original");
  const [opacity, setOpacity] = useState(75);
  const [showSegmentation, setShowSegmentation] = useState(false);
  const [showPerimeter, setShowPerimeter] = useState(false);

  const handleModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setShowSegmentation(mode === "segmentation" || mode === "comparison" || mode === "perimeter");
    setShowPerimeter(mode === "perimeter" || mode === "comparison");
  };

  const handleReset = () => {
    setViewMode("original");
    setOpacity(75);
    setShowSegmentation(false);
    setShowPerimeter(false);
  };

  const overlayOpacity = opacity / 100;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Notice */}
        <div className="flex items-start gap-2 bg-amber-950/30 border border-amber-800/30 rounded-lg p-3">
          <AlertTriangle size={12} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-200/70">
            <strong>Illustrative demonstration.</strong> The segmentation mask and perimeter shown below are CSS/SVG overlays. 
            They are not produced by a trained machine-learning model in this prototype.
          </p>
        </div>

        {/* Pipeline */}
        <div className="bg-[#161d2a] border border-[#1e2d3d] rounded-lg p-4">
          <div className="text-[10px] text-[#4a5568] uppercase tracking-wider mb-3">Proposed CV Pipeline (Illustrative)</div>
          <div className="flex items-center gap-1 flex-wrap">
            {["Input Image", "Candidate Region", "Segmentation Mask", "Boundary Extraction", "Geographic Assessment"].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-1">
                <div className={`px-2.5 py-1.5 rounded text-[10px] font-medium border transition-colors ${
                  (i === 0 && viewMode === "original") ||
                  (i === 1 && viewMode === "original") ||
                  (i === 2 && viewMode === "segmentation") ||
                  (i === 3 && viewMode === "perimeter") ||
                  (i === 4 && viewMode === "comparison")
                    ? "bg-green-900/40 border-green-700/40 text-green-300"
                    : "bg-[#1a2234] border-[#1e2d3d] text-[#4a5568]"
                }`}>
                  {step}
                </div>
                {i < arr.length - 1 && <span className="text-[#2d3f55] text-xs">&#x2192;</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Image analysis area */}
        <div className="bg-[#161d2a] border border-[#1e2d3d] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1e2d3d] flex items-center justify-between">
            <span className="text-xs font-semibold text-white">
              {viewMode === "original" && "A. Original Image — Sample Aerial View"}
              {viewMode === "segmentation" && "B. Segmentation Overlay — Illustrative Mask"}
              {viewMode === "perimeter" && "C. Perimeter Extraction — Illustrative Boundary"}
              {viewMode === "comparison" && "D. Side-by-Side Comparison"}
            </span>
            <span className="text-[10px] text-amber-400 bg-amber-950/40 border border-amber-800/30 px-1.5 py-0.5 rounded">ILLUSTRATIVE</span>
          </div>
          <div className="p-4">
            {viewMode === "comparison" ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] text-[#4a5568] mb-1">Original</div>
                  <AerialSVG showSeg={false} showPeri={false} opacity={overlayOpacity} />
                </div>
                <div>
                  <div className="text-[10px] text-[#4a5568] mb-1">With Overlays</div>
                  <AerialSVG showSeg={true} showPeri={true} opacity={overlayOpacity} />
                </div>
              </div>
            ) : (
              <AerialSVG showSeg={showSegmentation} showPeri={showPerimeter} opacity={overlayOpacity} />
            )}
          </div>
        </div>

        {/* Geographic assessment panel */}
        {(viewMode === "comparison") && (
          <div className="bg-[#161d2a] border border-[#1e2d3d] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[#1e2d3d]">
              <span className="text-xs font-semibold text-white">D. Geographic Assessment — Illustrative Perimeter & Assets</span>
            </div>
            <div className="p-4">
              <GeographicAssessmentPanel />
            </div>
          </div>
        )}

        {/* Results panel */}
        <div className="bg-[#161d2a] border border-[#1e2d3d] rounded-lg overflow-hidden">
          <div className="px-4 py-2.5 border-b border-[#1e2d3d]">
            <span className="text-xs font-semibold text-white">Illustrative Analysis Results</span>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            <ResultItem label="Sample Affected Area" value="~142 ha" note="Illustrative estimate only" />
            <ResultItem label="Sample Perimeter Length" value="~4.8 km" note="Illustrative estimate only" />
            <ResultItem label="Analysis Status" value={viewMode === "original" ? "Pending overlay" : "Overlay applied"} note="Illustrative state" highlight />
            <ResultItem label="Confidence / Uncertainty" value="Not applicable" note="No model used in this prototype" />
          </div>
          <div className="px-4 pb-4">
            <div className="flex items-start gap-1.5 bg-[#111827] border border-[#1e2d3d] rounded p-2.5">
              <Info size={10} className="text-[#4a5568] flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-[#4a5568]">
                All values are sample figures for demonstration. Do not infer actual model accuracy or validation scores from this interface.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right controls panel */}
      <div className="w-56 flex-shrink-0 border-l border-[#1e2d3d] overflow-y-auto bg-[#0d1117]">
        <div className="px-3 py-2.5 border-b border-[#1e2d3d]">
          <span className="text-[10px] text-[#4a5568] uppercase tracking-wider">Analysis Controls</span>
        </div>
        <div className="p-4 space-y-4">
          {/* View mode */}
          <div>
            <div className="text-[10px] text-[#4a5568] uppercase tracking-wider mb-2 flex items-center gap-1">
              <Eye size={10} /> View Mode
            </div>
            <div className="space-y-1">
              {([
                { mode: "original" as ViewMode, label: "Original Image" },
                { mode: "segmentation" as ViewMode, label: "Segmentation Overlay" },
                { mode: "perimeter" as ViewMode, label: "Perimeter Overlay" },
                { mode: "comparison" as ViewMode, label: "Side-by-Side" },
              ]).map((opt) => (
                <button
                  key={opt.mode}
                  onClick={() => handleModeChange(opt.mode)}
                  className={`w-full text-left px-2.5 py-2 rounded text-xs transition-colors ${
                    viewMode === opt.mode
                      ? "bg-[#1a2234] text-white border border-[#2d3f55]"
                      : "text-[#8b9bb4] hover:bg-[#111827] border border-transparent"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Overlay toggles */}
          <div>
            <div className="text-[10px] text-[#4a5568] uppercase tracking-wider mb-2 flex items-center gap-1">
              <Layers size={10} /> Overlays
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className={`w-7 h-4 rounded-full relative transition-colors ${showSegmentation ? "bg-red-700" : "bg-[#1e2d3d]"}`} onClick={() => setShowSegmentation((v) => !v)}>
                  <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${showSegmentation ? "translate-x-3.5" : "translate-x-0.5"}`} />
                </div>
                <span className="text-xs text-[#8b9bb4]">Segmentation Mask</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <div className={`w-7 h-4 rounded-full relative transition-colors ${showPerimeter ? "bg-orange-700" : "bg-[#1e2d3d]"}`} onClick={() => setShowPerimeter((v) => !v)}>
                  <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${showPerimeter ? "translate-x-3.5" : "translate-x-0.5"}`} />
                </div>
                <span className="text-xs text-[#8b9bb4]">Perimeter Boundary</span>
              </label>
            </div>
          </div>

          {/* Opacity */}
          <div>
            <div className="text-[10px] text-[#4a5568] uppercase tracking-wider mb-2 flex items-center gap-1">
              <SlidersHorizontal size={10} /> Overlay Opacity
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full accent-red-500"
            />
            <div className="text-[10px] text-[#4a5568] text-center mt-1">{opacity}%</div>
          </div>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-1.5 text-xs border border-[#1e2d3d] text-[#8b9bb4] py-2 rounded hover:bg-[#111827] transition-colors"
          >
            <RotateCcw size={11} /> Reset View
          </button>
        </div>
      </div>
    </div>
  );
}

function AerialSVG({ showSeg, showPeri, opacity }: { showSeg: boolean; showPeri: boolean; opacity: number }) {
  return (
    <div className="relative rounded overflow-hidden" style={{ paddingBottom: "62%" }}>
      <svg viewBox="0 0 640 400" className="absolute inset-0 w-full h-full" style={{ background: "#0a1a10" }}>
        <defs>
          <radialGradient id="fire" cx="45%" cy="55%" r="30%">
            <stop offset="0%" stopColor="#ef444450" />
            <stop offset="100%" stopColor="#0a1a1000" />
          </radialGradient>
        </defs>
        {/* Forest canopy */}
        {[...Array(40)].map((_, i) => (
          <ellipse key={i} cx={(i * 67 + 20) % 640} cy={((i * 51) % 360) + 20} rx={18 + (i % 6) * 7} ry={14 + (i % 5) * 5}
            fill={`hsl(${118 + (i % 15) * 2},${28 + (i % 12)}%,${8 + (i % 9)}%)`} />
        ))}
        {/* Terrain features */}
        <path d="M0,340 Q160,320 320,340 Q480,360 640,340 L640,400 L0,400Z" fill="#0d1208" />
        {/* Fire glow */}
        <ellipse cx={290} cy={220} rx={110} ry={75} fill="url(#fire)" />
        {/* Segmentation overlay */}
        {showSeg && (
          <g opacity={opacity}>
            <ellipse cx={290} cy={220} rx={95} ry={65} fill="#ef444440" stroke="#ef4444" strokeWidth={1} />
            <ellipse cx={270} cy={205} rx={55} ry={38} fill="#ef444450" />
            <ellipse cx={310} cy={235} rx={45} ry={30} fill="#ef444440" />
          </g>
        )}
        {/* Smoke */}
        {[...Array(10)].map((_, i) => (
          <ellipse key={`s${i}`} cx={260 + i * 10} cy={175 - i * 14} rx={18 + i * 3} ry={9 + i * 2} fill={`rgba(80,80,80,${0.35 - i * 0.03})`} />
        ))}
        {/* Perimeter overlay */}
        {showPeri && (
          <g opacity={opacity}>
            <polygon
              points="200,165 255,140 320,148 375,170 395,225 380,275 340,300 275,305 220,285 185,240 175,195"
              fill="none"
              stroke="#f97316"
              strokeWidth={2.5}
              strokeDasharray="6 3"
            />
            <circle cx={200} cy={165} r={4} fill="#f97316" opacity={0.8} />
            <circle cx={395} cy={225} r={4} fill="#f97316" opacity={0.8} />
          </g>
        )}
        {/* Labels */}
        {showSeg && (
          <text x={195} y={135} fill="#ef4444" fontSize={9} fontFamily="JetBrains Mono,monospace" opacity={0.9}>SEG MASK [ILLUS.]</text>
        )}
        {showPeri && (
          <text x={195} y={125} fill="#f97316" fontSize={9} fontFamily="JetBrains Mono,monospace" opacity={0.9}>PERIMETER [ILLUS.]</text>
        )}
        {/* Drone crosshair */}
        <line x1={285} y1={215} x2={295} y2={215} stroke="#fff" strokeWidth={0.8} opacity={0.4} />
        <line x1={290} y1={210} x2={290} y2={220} stroke="#fff" strokeWidth={0.8} opacity={0.4} />
        <circle cx={290} cy={215} r={14} fill="none" stroke="#fff" strokeWidth={0.7} opacity={0.3} />
        {/* HUD */}
        <rect x={8} y={8} width={145} height={48} fill="rgba(13,17,23,0.75)" rx={3} />
        <text x={14} y={22} fill="#4a5568" fontSize={8} fontFamily="JetBrains Mono,monospace">FIRESENTINEL CV LAB</text>
        <text x={14} y={34} fill="#8b9bb4" fontSize={8} fontFamily="JetBrains Mono,monospace">FS-2024-001 | SAMPLE</text>
        <text x={14} y={46} fill="#ef4444" fontSize={7} fontFamily="JetBrains Mono,monospace">ILLUSTRATIVE OVERLAYS</text>
        {/* Scale */}
        <rect x={490} y={375} width={60} height={3} fill="#2d3f55" rx={1.5} />
        <text x={490} y={390} fill="#4a5568" fontSize={7} fontFamily="Inter,sans-serif">~200m</text>
      </svg>
    </div>
  );
}

function GeographicAssessmentPanel() {
  return (
    <svg viewBox="0 0 500 200" className="w-full" style={{ background: "#0d1117" }}>
      <rect width={500} height={200} fill="#0d1117" />
      <ellipse cx={250} cy={100} rx={200} ry={120} fill="#0a2214" opacity={0.5} />
      {/* Perimeter */}
      <polygon points="200,50 270,35 340,55 370,100 360,145 310,168 240,170 185,150 165,105 175,65" fill="#ef444415" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 2" />
      {/* Settlement */}
      <rect x={40} y={70} width={30} height={20} fill="#1e3a5f" stroke="#3b82f6" strokeWidth={1} rx={2} />
      <text x={75} y={78} fill="#93c5fd" fontSize={9} fontFamily="Inter,sans-serif">Kurrajong Heights</text>
      <text x={75} y={88} fill="#4a5568" fontSize={8} fontFamily="Inter,sans-serif">1.8 km (critical)</text>
      <line x1={70} y1={80} x2={165} y2={100} stroke="#3b82f680" strokeWidth={1} strokeDasharray="3 2" />
      {/* Road */}
      <line x1={0} y1={170} x2={500} y2={130} stroke="#2d3f55" strokeWidth={3} />
      <text x={10} y={165} fill="#4a5568" fontSize={8} fontFamily="Inter,sans-serif">Ridge Fire Road 7</text>
      {/* Hotspot center */}
      <circle cx={265} cy={100} r={6} fill="#ef4444" opacity={0.9} />
      <circle cx={265} cy={100} r={14} fill="none" stroke="#ef444440" strokeWidth={1.5} />
      <text x={275} y={97} fill="#ef4444" fontSize={9} fontFamily="JetBrains Mono,monospace">FS-2024-001</text>
      {/* Scale */}
      <rect x={400} y={185} width={50} height={2.5} fill="#2d3f55" />
      <text x={400} y={196} fill="#4a5568" fontSize={7} fontFamily="Inter,sans-serif">~2 km</text>
      {/* Label */}
      <text x={8} y={15} fill="#4a5568" fontSize={8} fontFamily="Inter,sans-serif">GEOGRAPHIC ASSESSMENT [ILLUSTRATIVE]</text>
    </svg>
  );
}

function ResultItem({ label, value, note, highlight }: { label: string; value: string; note: string; highlight?: boolean }) {
  return (
    <div className="bg-[#111827] border border-[#1e2d3d] rounded p-3">
      <div className="text-[10px] text-[#4a5568] uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-sm font-mono font-semibold ${highlight ? "text-green-400" : "text-white"}`}>{value}</div>
      <div className="text-[10px] text-[#4a5568] italic mt-0.5">{note}</div>
    </div>
  );
}
