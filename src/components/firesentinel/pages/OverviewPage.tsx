"use client";
import { Flame, CheckCircle, AlertTriangle, Clock, ArrowRight, TrendingUp, Radio } from "lucide-react";
import { MOCK_INCIDENTS, SUMMARY_METRICS } from "../../../lib/firesentinel/mockData";
import { StatusBadge } from "../shared/StatusBadge";
import { MetricCard } from "../shared/MetricCard";
import { type NavPage } from "../../../lib/firesentinel/types";

const TIMELINE = [
  { time: "08:23", event: "FS-2024-001 detected via VIIRS — Pench, MP",              type: "detection" },
  { time: "08:41", event: "Drone inspection initiated at Seoni Base",                 type: "mission"   },
  { time: "09:12", event: "FS-2024-001 inspection complete — supporting evidence",    type: "complete"  },
  { time: "09:47", event: "FS-2024-002 MODIS anomaly detected — Mudumalai, TN",      type: "detection" },
  { time: "10:05", event: "FS-2024-003 inconclusive result — Kandhamal smoke haze",  type: "alert"     },
  { time: "11:05", event: "FS-2024-004 drone en route — Jim Corbett, UK",            type: "mission"   },
  { time: "22:44", event: "FS-2024-005 low-priority burn-off — Dharwad, KA",        type: "low"       },
];

const PRIORITY_DIST = [
  { label: "Immediate Review",   count: 1, color: "#ef4444", glow: "#ef444440", pct: 20 },
  { label: "Prompt Review",      count: 1, color: "#f59e0b", glow: "#f59e0b40", pct: 20 },
  { label: "Further Assessment", count: 2, color: "#eab308", glow: "#eab30840", pct: 40 },
  { label: "Monitor / Low",      count: 1, color: "#6b7280", glow: "#6b728040", pct: 20 },
];

const TYPE_STYLE: Record<string, { dot: string; line: string }> = {
  detection: { dot: "#f59e0b", line: "#f59e0b30" },
  mission:   { dot: "#3b82f6", line: "#3b82f630" },
  complete:  { dot: "#22c55e", line: "#22c55e30" },
  alert:     { dot: "#eab308", line: "#eab30830" },
  low:       { dot: "#4b5563", line: "#4b556330" },
};

export function OverviewPage({ onNavigate, onSelectIncident, searchQuery }: {
  onNavigate: (page: NavPage) => void;
  onSelectIncident: (id: string) => void;
  searchQuery: string;
}) {
  const filtered = MOCK_INCIDENTS.filter(
    (i) =>
      i.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-5 space-y-5 overflow-y-auto h-full" style={{ background: "var(--bg-base)" }}>

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio size={12} style={{ color: "#334a66" }} />
          <p className="text-xs" style={{ color: "#334a66" }}>
            5 simulated incidents · Indian forest regions · Prototype only
          </p>
        </div>
        <button
          onClick={() => onNavigate("incident_map")}
          className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl text-white transition-all hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg,#f97316,#ef4444)",
            boxShadow: "0 4px 20px rgba(249,115,22,0.4)",
          }}
        >
          Open India Map <ArrowRight size={12} />
        </button>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard label="Candidate Hotspots"   value={SUMMARY_METRICS.totalCandidates}      subtext="Simulated records"  color="amber" icon={<Flame size={14} />} />
        <MetricCard label="Inspections Done"      value={SUMMARY_METRICS.inspectionsCompleted} subtext="Simulated missions" color="green" icon={<CheckCircle size={14} />} />
        <MetricCard label="Require Review"        value={SUMMARY_METRICS.requireReview}        subtext="Active or supporting" color="red"  icon={<AlertTriangle size={14} />} />
        <MetricCard label="Missions In Progress"  value={SUMMARY_METRICS.missionsInProgress}   subtext="Simulated drone ops" color="blue" icon={<Clock size={14} />} />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Incidents table */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden card-hover"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="px-4 py-3 flex items-center justify-between"
            style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.015)" }}>
            <div className="flex items-center gap-2">
              <TrendingUp size={12} style={{ color: "#f97316" }} />
              <span className="text-xs font-bold text-white">Recent Incidents — India</span>
            </div>
            <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded-lg"
              style={{ background: "rgba(255,255,255,0.04)", color: "#334a66", border: "1px solid #16202e" }}>
              SIMULATED
            </span>
          </div>
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-sm" style={{ color: "#334a66" }}>No incidents match your search.</div>
          ) : (
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {filtered.map((inc) => (
                <button
                  key={inc.id}
                  onClick={() => { onSelectIncident(inc.id); onNavigate("incident_map"); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left group transition-all"
                  style={{ borderColor: "var(--border)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    inc.status === "inspected_supporting"   ? "bg-red-500"     :
                    inc.status === "under_inspection"       ? "bg-blue-400"    :
                    inc.status === "inspected_inconclusive" ? "bg-yellow-400"  :
                    inc.status === "low_priority"           ? "bg-neutral-500" : "bg-amber-400"
                  }`}
                    style={{ boxShadow: `0 0 6px currentColor` }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-white">{inc.id}</span>
                      <StatusBadge type="incident" value={inc.status} />
                    </div>
                    <div className="text-[11px] truncate" style={{ color: "#334a66" }}>
                      {inc.description.slice(0, 85)}...
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-sm font-black tabular-nums" style={{ color: "#6b82a0" }}>
                      {inc.illustrativeConfidence}%
                    </div>
                    <div className="text-[9px]" style={{ color: "#223040" }}>conf.</div>
                  </div>
                  <ArrowRight size={12} style={{ color: "#1e2f45" }} className="flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Priority chart */}
          <div className="rounded-2xl overflow-hidden card-hover"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="px-4 py-3 flex items-center gap-2"
              style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.015)" }}>
              <span className="text-xs font-bold text-white">Priority Distribution</span>
            </div>
            <div className="p-4 space-y-3.5">
              {PRIORITY_DIST.map((p) => (
                <div key={p.label}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px]" style={{ color: "#6b82a0" }}>{p.label}</span>
                    <span className="text-xs font-black tabular-nums" style={{ color: p.color }}>{p.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#0d1520" }}>
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${p.pct}%`, background: p.color, boxShadow: `0 0 8px ${p.color}80` }}
                    />
                  </div>
                </div>
              ))}
              <p className="text-[9px] pt-1" style={{ color: "#223040" }}>Illustrative rule engine only.</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-2xl overflow-hidden card-hover"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="px-4 py-3 flex items-center justify-between"
              style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.015)" }}>
              <span className="text-xs font-bold text-white">Mission Timeline</span>
              <span className="text-[9px] px-2 py-0.5 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", color: "#334a66", border: "1px solid #16202e" }}>
                14 Nov 2024 · Sim.
              </span>
            </div>
            <div className="p-4 relative">
              {/* Timeline track */}
              <div className="absolute left-[37px] top-4 bottom-4 w-px" style={{ background: "linear-gradient(180deg, #1e2f45 0%, transparent 100%)" }} />
              <div className="space-y-3.5">
                {TIMELINE.map((t, i) => {
                  const s = TYPE_STYLE[t.type];
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-[10px] font-mono w-10 flex-shrink-0 pt-0.5" style={{ color: "#2a3f55" }}>{t.time}</span>
                      <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1 relative z-10"
                        style={{ background: s.dot, boxShadow: `0 0 6px ${s.dot}` }} />
                      <span className="text-[11px] leading-tight" style={{ color: "#5a7090" }}>{t.event}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
