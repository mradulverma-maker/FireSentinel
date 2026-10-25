"use client";
import { Flame, Satellite, Navigation, Cpu, AlertTriangle, CheckCircle2, Shield, Zap } from "lucide-react";

const STEPS = [
  { n: "01", icon: <Satellite size={16} />, title: "Detect", color: "#f97316",
    desc: "Satellite hotspot data (VIIRS, MODIS) identifies candidate thermal anomalies in forested areas." },
  { n: "02", icon: <Navigation size={16} />, title: "Verify", color: "#3b82f6",
    desc: "A fixed-wing or multirotor drone is dispatched to inspect the candidate hotspot and capture aerial imagery." },
  { n: "03", icon: <Cpu size={16} />, title: "Analyse", color: "#22c55e",
    desc: "Computer vision analyses imagery to estimate fire extent, perimeter, and proximity to critical assets." },
  { n: "04", icon: <Zap size={16} />, title: "Respond", color: "#ef4444",
    desc: "A rule engine generates an explainable recommendation for human responders from the incident list." },
];

const TECH = [
  { label: "React + TypeScript", note: "Frontend framework" },
  { label: "Next.js 15", note: "App shell & routing" },
  { label: "Tailwind CSS", note: "Styling" },
  { label: "Leaflet / React-Leaflet", note: "Interactive map" },
  { label: "Lucide React", note: "Iconography" },
  { label: "OpenStreetMap", note: "Map tile provider" },
];

export function AboutPage() {
  return (
    <div className="p-6 overflow-y-auto h-full space-y-6" style={{ background: "var(--bg-base)" }}>

      {/* Hero banner */}
      <div className="rounded-2xl overflow-hidden relative"
        style={{ background: "linear-gradient(135deg,#0e1520 0%,#10182a 50%,#0a1018 100%)", border: "1px solid #1e2f45" }}>
        {/* Ambient glows */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl pointer-events-none"
          style={{ background: "rgba(249,115,22,0.06)" }} />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none"
          style={{ background: "rgba(59,130,246,0.05)" }} />

        <div className="relative p-8">
          <div className="flex items-start gap-5">
            <div className="relative w-14 h-14 flex-shrink-0">
              <div className="absolute inset-0 rounded-2xl blur-lg" style={{ background: "rgba(249,115,22,0.4)" }} />
              <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#1a0800,#2d1000)", border: "1px solid rgba(249,115,22,0.5)" }}>
                <Flame size={24} className="text-orange-400" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-black tracking-tight text-shimmer mb-1">FireSentinel</h1>
              <p className="text-sm font-medium mb-3" style={{ color: "#6b82a0" }}>
                Satellite-to-Drone Wildfire Intelligence Platform
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl"
                style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)" }}>
                <AlertTriangle size={11} className="text-amber-500" />
                <span className="text-[11px] font-bold tracking-wider uppercase text-amber-400">
                  Student Innovation Project · Prototype Demonstration
                </span>
              </div>
            </div>
          </div>

          <p className="mt-5 text-sm leading-relaxed" style={{ color: "#5a7090" }}>
            FireSentinel is a proposed wildfire intelligence system concept developed as a student innovation project.
            This frontend prototype demonstrates the envisioned workflow using{" "}
            <span className="text-amber-400 font-semibold">simulated data only</span>. There is no real satellite
            connection, backend, trained AI model, real drone, or live telemetry. All incidents shown are
            fictional records set in Indian forest regions.
          </p>
        </div>
      </div>

      {/* Workflow grid */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1" style={{ background: "var(--border)" }} />
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#334a66" }}>
            Proposed Workflow · Detect. Verify. Respond.
          </span>
          <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-2xl p-5 card-hover relative overflow-hidden"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl pointer-events-none"
                style={{ background: `${s.color}15` }} />
              <div className="text-[10px] font-black tracking-widest mb-3 relative" style={{ color: `${s.color}60` }}>
                STEP {s.n}
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 relative"
                style={{ background: `${s.color}12`, border: `1px solid ${s.color}30`, color: s.color }}>
                {s.icon}
              </div>
              <div className="font-bold text-white mb-2 relative">{s.title}</div>
              <div className="text-[11px] leading-relaxed relative" style={{ color: "#4a6080" }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom 2-col */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tech stack */}
        <div className="rounded-2xl overflow-hidden card-hover"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="px-5 py-3.5 flex items-center gap-2"
            style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.015)" }}>
            <Cpu size={12} style={{ color: "#3b82f6" }} />
            <span className="text-xs font-bold text-white">Technology Stack</span>
          </div>
          <div className="p-4 grid grid-cols-2 gap-2">
            {TECH.map((t) => (
              <div key={t.label} className="flex items-start gap-2 p-2.5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid #16202e" }}>
                <CheckCircle2 size={10} className="text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-semibold text-white">{t.label}</div>
                  <div className="text-[10px]" style={{ color: "#334a66" }}>{t.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="rounded-2xl overflow-hidden card-hover"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="px-5 py-3.5 flex items-center gap-2"
            style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.015)" }}>
            <Shield size={12} style={{ color: "#f59e0b" }} />
            <span className="text-xs font-bold text-white">Important Disclaimers</span>
          </div>
          <div className="p-4 space-y-3">
            {[
              "All incident data, coordinates and metrics are simulated mock records.",
              "No trained machine-learning or AI model is used in this prototype.",
              "Computer vision overlays are CSS/SVG illustrations, not real predictions.",
              "The rule engine is a simple transparent frontend function, not a validated risk model.",
              "No real satellite, drone, sensor or external service is connected.",
              "Recommendations are for demonstration and human review only.",
            ].map((d, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <AlertTriangle size={10} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed" style={{ color: "#4a6080" }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
