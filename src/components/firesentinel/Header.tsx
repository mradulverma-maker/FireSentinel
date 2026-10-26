"use client";
import { Search, AlertTriangle, Satellite, Zap } from "lucide-react";
import { type NavPage } from "../../lib/firesentinel/types";

const PAGE_META: Record<NavPage, { title: string; sub: string; icon: string }> = {
  overview:            { title: "Command Overview",         sub: "System status & recent detections",        icon: "⬡" },
  incident_map:        { title: "Incident Map",             sub: "Live hotspot map — India forest regions",  icon: "◉" },
  cv_lab:              { title: "Computer Vision Lab",      sub: "Illustrative aerial imagery analysis",     icon: "⬟" },
  drone_simulator:     { title: "Drone Mission Simulator",  sub: "Simulated UAV inspection workflow",        icon: "◈" },
  response_priorities: { title: "Response Priorities",      sub: "Rule-engine recommendations",              icon: "⬠" },
  about:               { title: "About FireSentinel",       sub: "Student innovation project — prototype",   icon: "◇" },
};

export function Header({ activePage, searchQuery, onSearchChange }: {
  activePage: NavPage; searchQuery: string; onSearchChange: (q: string) => void;
}) {
  const { title, sub, icon } = PAGE_META[activePage];
  return (
    <header
      className="h-14 flex items-center gap-4 px-5 flex-shrink-0 relative"
      style={{
        background: "linear-gradient(90deg, #070b12 0%, #080d15 100%)",
        borderBottom: "1px solid #14202e",
      }}
    >
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(249,115,22,0.4), rgba(59,130,246,0.3), transparent)" }} />

      {/* Page title */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <span className="text-[16px] leading-none" style={{ color: "#f97316", opacity: 0.7 }}>{icon}</span>
        <div>
          <h1 className="text-sm font-bold text-white leading-tight tracking-tight">{title}</h1>
          <p className="text-[10px] leading-tight mt-0.5" style={{ color: "#334a66" }}>{sub}</p>
        </div>
      </div>

      <div className="h-6 w-px flex-shrink-0" style={{ background: "#14202e" }} />

      {/* Search */}
      <div className="flex-1 max-w-xs relative">
        <Search size={11} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#2a3f55" }} />
        <input
          type="text"
          placeholder="Search incidents..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl text-xs pl-8 pr-3 py-2 transition-all focus:outline-none"
          style={{
            background: "rgba(8,13,21,0.8)",
            border: "1px solid #16202e",
            color: "#c0d0e8",
          }}
          onFocus={(e) => {
            e.target.style.border = "1px solid rgba(249,115,22,0.3)";
            e.target.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.06)";
          }}
          onBlur={(e) => {
            e.target.style.border = "1px solid #16202e";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      {/* Right */}
      <div className="ml-auto flex items-center gap-2.5">
        {/* Satellite sources */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{ background: "rgba(8,13,21,0.7)", border: "1px solid #16202e" }}>
          <Satellite size={10} style={{ color: "#334a66" }} />
          <span className="text-[10px] tracking-wide" style={{ color: "#334a66" }}>VIIRS · MODIS · Himawari-9</span>
        </div>

        {/* Simulated data pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
          style={{
            background: "rgba(180,83,9,0.1)",
            border: "1px solid rgba(249,115,22,0.25)",
            boxShadow: "0 0 12px rgba(249,115,22,0.08)",
          }}>
          <AlertTriangle size={10} className="text-amber-500" />
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#f59e0b" }}>Simulated Data</span>
        </div>

        {/* Status */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
          style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}>
          <span className="relative w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-50" />
            <span className="relative block w-2 h-2 rounded-full bg-green-500" />
          </span>
          <span className="text-[10px] font-medium" style={{ color: "#22c55e" }}>Ready</span>
        </div>
      </div>
    </header>
  );
}

