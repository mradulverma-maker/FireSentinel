"use client";
import { useState } from "react";
import { Wind, Thermometer, Droplets, AlertTriangle, Users, MapPin, Info } from "lucide-react";
import { MOCK_COMMUNITIES, MOCK_WEATHER } from "../../../lib/firesentinel/mockData";
import type { TimeStep } from "../../../lib/firesentinel/types";

const STEPS: TimeStep[] = ["current", "+15min", "+30min", "+60min"];

const DATA: Record<TimeStep, { areaHa: number; radius: string; color: string; comms: string[]; factor: string; wind: string }> = {
  "current": { areaHa: 142, radius: "~1.4 km", color: "#f9731630", comms: ["COM-001", "COM-003"], factor: "Active perimeter", wind: "NE wind pushing toward Seoni Village" },
  "+15min":  { areaHa: 178, radius: "~1.7 km", color: "#f5950b30", comms: ["COM-001", "COM-003"], factor: "+25% projected", wind: "Village edge approaching zone" },
  "+30min":  { areaHa: 230, radius: "~2.1 km", color: "#ef444430", comms: ["COM-001", "COM-002", "COM-003"], factor: "+62% projected", wind: "Pench Kisan Colony entering zone" },
  "+60min":  { areaHa: 340, radius: "~2.8 km", color: "#dc262630", comms: ["COM-001", "COM-002", "COM-003", "COM-005"], factor: "+139% projected", wind: "Tourism Zone approaching boundary" },
};

const ARROWS: Record<string, string> = { N: "\u2191", NE: "\u2197", E: "\u2192", SE: "\u2198", S: "\u2193", SW: "\u2199", W: "\u2190", NW: "\u2196" };

const FACTORS = [
  { l: "Wind Direction", v: "NE at 22 km/h", i: <Wind size={12} />, c: "#3b82f6" },
  { l: "Temperature", v: "34\u00B0C ambient", i: <Thermometer size={12} />, c: "#f97316" },
  { l: "Humidity", v: "21% (very low)", i: <Droplets size={12} />, c: "#f59e0b" },
  { l: "Fuel Load", v: "Dense sal canopy (illustrative)", i: <AlertTriangle size={12} />, c: "#ef4444" },
  { l: "Slope", v: "Moderate uphill NE (illustrative)", i: <MapPin size={12} />, c: "#8b5cf6" },
];

function MapSVG({ step }: { step: TimeStep }) {
  const d = DATA[step];
  const rx: Record<TimeStep, [number, number]> = { "current": [18, 14], "+15min": [22, 18], "+30min": [28, 23], "+60min": [36, 30] };
  const [a, b] = rx[step];
  const comms = [
    { id: "COM-001", x: 58, y: 38, n: "Seoni Village" },
    { id: "COM-002", x: 65, y: 30, n: "Pench Kisan Colony" },
    { id: "COM-003", x: 44, y: 55, n: "NH-30 Dhaba" },
    { id: "COM-004", x: 72, y: 25, n: "Turiya Hamlet" },
    { id: "COM-005", x: 62, y: 20, n: "Tourism Zone" },
  ];
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <rect x="0" y="0" width="100" height="80" fill="#060a10" />
      <ellipse cx="50" cy="45" rx="48" ry="35" fill="#0a1a0a" opacity="0.6" />
      <ellipse cx="52" cy="44" rx={a + 12} ry={b + 10} fill={d.color} stroke="#f9731660" strokeWidth="0.5" strokeDasharray="2 1" />
      <ellipse cx="50" cy="46" rx={a} ry={b} fill="#ef444418" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3 1.5" />
      <ellipse cx="50" cy="46" rx={a * 0.5} ry={b * 0.5} fill="#f97316" opacity="0.4" />
      <ellipse cx="50" cy="46" rx={a * 0.25} ry={b * 0.25} fill="#ef4444" opacity="0.7" />
      <text x="85" y="12" fontSize="5" fill="#3b82f6" textAnchor="middle">NE</text>
      <text x="85" y="20" fontSize="12" fill="#3b82f6" textAnchor="middle">{"\u2197"}</text>
      <line x1="10" y1="60" x2="90" y2="55" stroke="#2d3f55" strokeWidth="0.6" strokeDasharray="3 1" />
      <text x="15" y="58" fontSize="3.5" fill="#334a66">NH-30</text>
      {comms.map((c) => { const iz = d.comms.includes(c.id); return (
        <g key={c.id}>
          <circle cx={c.x} cy={c.y} r={iz ? 3 : 2} fill={iz ? "#ef4444" : "#3b82f6"} stroke={iz ? "#fca5a5" : "#93c5fd"} strokeWidth="0.5" opacity={0.9} />
          <text x={c.x + 3} y={c.y + 1.5} fontSize="3" fill={iz ? "#fca5a5" : "#93c5fd"}>{c.n}</text>
        </g>
      ); })}
      <text x="50" y="76" fontSize="3.5" fill="#1e2f45" textAnchor="middle" fontStyle="italic">ILLUSTRATIVE SIMULATION — NOT A VALIDATED FORECAST</text>
    </svg>
  );
}

export function FireSpreadPage() {
  const [step, setStep] = useState<TimeStep>("current");
  const d = DATA[step]; const w = MOCK_WEATHER;
  return (
    <div className="flex h-full overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <div className="w-72 flex-shrink-0 flex flex-col overflow-y-auto" style={{ borderRight: "1px solid var(--border)" }}>
        <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.015)" }}>
          <div className="flex items-center gap-2 mb-1"><Wind size={13} style={{ color: "#f97316" }} /><span className="text-xs font-bold text-white">Fire Spread &amp; Community Risk</span></div>
          <p className="text-[10px]" style={{ color: "#334a66" }}>Linked to FS-2024-001 &middot; Illustrative simulation</p>
        </div>
        <div className="p-3" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#334a66" }}>Projected Time Step</div>
          <div className="grid grid-cols-2 gap-1.5">
            {STEPS.map((t) => (
              <button key={t} onClick={() => setStep(t)} className="rounded-xl py-2 text-xs font-bold transition-all"
                style={step === t ? { background: "linear-gradient(135deg,rgba(249,115,22,0.2),rgba(239,68,68,0.15))", border: "1px solid rgba(249,115,22,0.4)", color: "#f97316" }
                  : { background: "rgba(255,255,255,0.03)", border: "1px solid #16202e", color: "#6b82a0" }}>{t === "current" ? "Current" : t}</button>
            ))}
          </div>
          <div className="mt-2 rounded-xl p-2.5" style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.15)" }}>
            <div className="text-[10px] font-bold" style={{ color: "#f97316" }}>Illustrative Area: {d.areaHa} ha</div>
            <div className="text-[10px]" style={{ color: "#6b82a0" }}>{d.radius} &middot; {d.factor}</div>
          </div>
        </div>
        <div className="p-3" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#334a66" }}>Weather (Simulated)</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl p-2.5 text-center" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)" }}>
              <div className="text-xl mb-0.5" style={{ color: "#3b82f6" }}>{ARROWS[w.windDirection]}</div>
              <div className="text-xs font-black" style={{ color: "#3b82f6" }}>{w.windDirection} {w.windSpeedKmh}km/h</div>
            </div>
            <div className="rounded-xl p-2.5 text-center" style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.15)" }}>
              <div className="text-xl font-black mb-0.5" style={{ color: "#f97316" }}>{w.tempC}&deg;</div>
              <div className="text-xs font-black" style={{ color: "#f97316" }}>{w.humidityPct}% hum</div>
            </div>
          </div>
          <div className="mt-2 text-[10px] italic" style={{ color: "#334a66" }}>{d.wind}</div>
        </div>
        <div className="p-3 flex-1">
          <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#334a66" }}>Illustrative Risk Factors</div>
          <div className="space-y-2">
            {FACTORS.map((f) => (
              <div key={f.l} className="flex items-start gap-2.5 p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #16202e" }}>
                <span style={{ color: f.c }} className="flex-shrink-0 mt-0.5">{f.i}</span>
                <div><div className="text-[10px] font-semibold" style={{ color: f.c }}>{f.l}</div><div className="text-[10px]" style={{ color: "#6b82a0" }}>{f.v}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-5 py-2.5 flex items-center gap-2 flex-shrink-0" style={{ background: "rgba(249,115,22,0.06)", borderBottom: "1px solid rgba(249,115,22,0.15)" }}>
          <Info size={11} className="text-amber-500 flex-shrink-0" />
          <p className="text-[10px]" style={{ color: "#d97706" }}><strong>Illustrative simulation only.</strong> Not a validated fire-spread model. Not an evacuation boundary.</p>
        </div>
        <div className="flex-1 relative overflow-hidden" style={{ minHeight: 0 }}>
          <MapSVG step={step} />
          <div className="absolute top-3 right-3 px-2.5 py-1.5 rounded-xl z-10 text-[10px] font-bold" style={{ background: "rgba(6,10,16,0.85)", border: "1px solid #1e2f45", color: "#334a66" }}>ILLUSTRATIVE MAP DATA</div>
          <div className="absolute top-3 left-3 px-2.5 py-1.5 rounded-xl z-10" style={{ background: "rgba(6,10,16,0.85)", border: "1px solid rgba(249,115,22,0.3)" }}>
            <div className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "#f97316" }}>{step === "current" ? "Current" : `Projected ${step}`}</div>
            <div className="text-[10px] font-black" style={{ color: "#e4edf8" }}>{d.areaHa} ha illustrative</div>
          </div>
        </div>
        <div className="flex-shrink-0" style={{ borderTop: "1px solid var(--border)", maxHeight: "220px", overflowY: "auto" }}>
          <div className="px-5 py-2.5 sticky top-0 flex items-center gap-2" style={{ background: "var(--bg-base)", borderBottom: "1px solid var(--border)" }}>
            <Users size={12} style={{ color: "#f97316" }} /><span className="text-xs font-bold text-white">Communities &mdash; Illustrative Risk</span>
            <span className="ml-auto text-[9px]" style={{ color: "#334a66" }}>{d.comms.length} in projected zone</span>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {MOCK_COMMUNITIES.map((c) => { const iz = d.comms.includes(c.id); return (
              <div key={c.id} className="flex items-center gap-3 px-5 py-2.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: iz ? "#ef4444" : "#334a66", boxShadow: iz ? "0 0 6px #ef4444" : undefined }} />
                <div className="flex-1 min-w-0"><div className="text-xs font-semibold text-white">{c.name}</div><div className="text-[10px]" style={{ color: "#334a66" }}>Pop. ~{c.population} &middot; {c.distanceKm} km</div></div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg" style={iz ? { background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }
                  : c.nearZone ? { background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", color: "#fcd34d" }
                  : { background: "rgba(255,255,255,0.03)", border: "1px solid #16202e", color: "#334a66" }}>
                  {iz ? "In zone" : c.nearZone ? "Near zone" : "Outside"}
                </span>
              </div>
            ); })}
          </div>
        </div>
      </div>
    </div>
  );
}
