"use client";
import { useState } from "react";
import { Radio, Thermometer, Droplets, Wind, AlertTriangle, CheckCircle2, WifiOff, Clock } from "lucide-react";
import type { Sensor, TimelineEvent } from "../../../lib/firesentinel/types";
import { MOCK_SENSORS, MOCK_TIMELINE } from "../../../lib/firesentinel/mockData";

const SS: Record<string, { dot: string; bg: string; border: string; label: string }> = {
  online:  { dot: "#22c55e", bg: "rgba(34,197,94,0.08)",  border: "rgba(34,197,94,0.2)",  label: "Online"  },
  offline: { dot: "#6b7280", bg: "rgba(107,114,128,0.08)", border: "rgba(107,114,128,0.2)", label: "Offline" },
  warning: { dot: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.2)",  label: "Warning" },
};

const EC: Record<string, string> = {
  detection: "#f59e0b", sensor: "#8b5cf6", drone: "#3b82f6", assessment: "#22c55e",
  warning: "#ef4444", spread: "#f97316", alert: "#ec4899",
};

export function SensorNetworkPage() {
  const [sensors, setSensors] = useState<Sensor[]>(MOCK_SENSORS);
  const [selectedId, setSelectedId] = useState<string | null>("SEN-001");
  const [timeline, setTimeline] = useState<TimelineEvent[]>(MOCK_TIMELINE);
  const [alertFired, setAlertFired] = useState(false);

  const selected = sensors.find((s) => s.id === selectedId) ?? null;

  const handleSmokeAlert = () => {
    setSensors((prev) => prev.map((s) => s.id === "SEN-002" ? { ...s, status: "warning" as const, smokeIndexPpm: 410, tempC: 52.1, humidityPct: 15 } : s));
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setTimeline((prev) => [
      { id: `TL-S1-${Date.now()}`, time: now, type: "sensor", incidentId: "FS-2024-001", label: "SEN-002 simulated smoke alert", detail: "Smoke index escalated to 410 ppm at Pench South Node", simulated: true },
      { id: `TL-S2-${Date.now()}`, time: now, type: "alert", incidentId: "FS-2024-SIM", label: "Suspected incident auto-flagged", detail: "New suspected incident FS-2024-SIM created from sensor spike at SEN-002", simulated: true },
      ...prev,
    ]);
    setAlertFired(true);
    setSelectedId("SEN-002");
  };

  const onC = sensors.filter((s) => s.status === "online").length;
  const wC = sensors.filter((s) => s.status === "warning").length;
  const oC = sensors.filter((s) => s.status === "offline").length;

  return (
    <div className="flex h-full overflow-hidden" style={{ background: "var(--bg-base)" }}>
      {/* Left panel */}
      <div className="w-72 flex-shrink-0 flex flex-col overflow-hidden" style={{ borderRight: "1px solid var(--border)" }}>
        <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.015)" }}>
          <div className="flex items-center gap-2 mb-3"><Radio size={13} style={{ color: "#8b5cf6" }} /><span className="text-xs font-bold text-white">Local Sensor Network</span></div>
          <div className="grid grid-cols-3 gap-1.5">
            {[{ l: "Online", c: onC, co: "#22c55e" }, { l: "Warning", c: wC, co: "#f59e0b" }, { l: "Offline", c: oC, co: "#6b7280" }].map((s) => (
              <div key={s.l} className="rounded-xl p-2 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #16202e" }}>
                <div className="text-sm font-black tabular-nums" style={{ color: s.co }}>{s.c}</div>
                <div className="text-[9px]" style={{ color: "#334a66" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-3 py-2.5 flex-shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
          <button onClick={handleSmokeAlert} disabled={alertFired}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all"
            style={alertFired ? { background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", color: "#22c55e" }
              : { background: "linear-gradient(135deg,rgba(239,68,68,0.15),rgba(249,115,22,0.12))", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", boxShadow: "0 0 16px rgba(239,68,68,0.1)" }}>
            {alertFired ? <><CheckCircle2 size={12} /> Alert Simulated</> : <><AlertTriangle size={12} /> Simulate Smoke Alert</>}
          </button>
          <p className="text-[9px] text-center mt-1.5" style={{ color: "#223040" }}>Escalates SEN-002 &middot; Creates simulated incident</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {sensors.map((s) => {
            const st = SS[s.status]; const sel = selectedId === s.id;
            return (
              <button key={s.id} onClick={() => setSelectedId(s.id)} className="w-full text-left rounded-2xl p-3.5 transition-all card-hover"
                style={{ background: sel ? "rgba(59,130,246,0.08)" : st.bg, border: `1px solid ${sel ? "rgba(59,130,246,0.35)" : st.border}` }}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div><div className="text-xs font-bold text-white">{s.id}</div><div className="text-[11px]" style={{ color: "#6b82a0" }}>{s.name}</div></div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: st.bg, border: `1px solid ${st.border}` }}>
                    {s.status === "offline" ? <WifiOff size={9} style={{ color: st.dot }} /> : <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot, boxShadow: `0 0 6px ${st.dot}` }} />}
                    <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: st.dot }}>{st.label}</span>
                  </div>
                </div>
                {s.status === "offline" ? <div className="text-[11px] italic" style={{ color: "#334a66" }}>No signal</div> : (
                  <div className="grid grid-cols-3 gap-1.5">
                    {[{ v: `${s.tempC}\u00B0`, l: "Temp", c: s.tempC > 45 ? "#ef4444" : "#e4edf8", i: <Thermometer size={9} /> },
                      { v: `${s.humidityPct}%`, l: "Hum", c: s.humidityPct < 25 ? "#f59e0b" : "#e4edf8", i: <Droplets size={9} /> },
                      { v: `${s.smokeIndexPpm}`, l: "ppm", c: s.smokeIndexPpm > 200 ? "#ef4444" : "#e4edf8", i: <Wind size={9} /> }
                    ].map((m) => (
                      <div key={m.l} className="rounded-lg p-1.5 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #16202e" }}>
                        <div className="text-xs font-black tabular-nums" style={{ color: m.c }}>{m.v}</div>
                        <div className="text-[8px]" style={{ color: "#334a66" }}>{m.l}</div>
                      </div>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
          <p className="text-[9px] text-center pt-1" style={{ color: "#1e2f45" }}>All readings are SIMULATED</p>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-shrink-0 p-5" style={{ borderBottom: "1px solid var(--border)" }}>
          {selected ? (
            <div>
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base font-black text-white">{selected.id}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-lg" style={{ background: SS[selected.status].bg, border: `1px solid ${SS[selected.status].border}`, color: SS[selected.status].dot }}>{SS[selected.status].label}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.04)", color: "#334a66", border: "1px solid #16202e" }}>SIMULATED</span>
                  </div>
                  <div className="text-sm" style={{ color: "#6b82a0" }}>{selected.name}</div>
                  <div className="text-[11px] mt-0.5 font-mono" style={{ color: "#334a66" }}>{selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}</div>
                </div>
                {selected.incidentId && (
                  <div className="px-3 py-2 rounded-xl" style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)" }}>
                    <div className="text-[9px] uppercase tracking-wider mb-0.5" style={{ color: "#f97316" }}>Linked Incident</div>
                    <div className="text-xs font-mono font-bold" style={{ color: "#f97316" }}>{selected.incidentId}</div>
                  </div>
                )}
              </div>
              {selected.status !== "offline" ? (
                <div className="grid grid-cols-3 gap-3">
                  {[{ l: "Temperature", v: `${selected.tempC}\u00B0C`, i: <Thermometer size={14} />, c: selected.tempC > 45 ? "#ef4444" : "#f97316", a: selected.tempC > 45 },
                    { l: "Humidity", v: `${selected.humidityPct}%`, i: <Droplets size={14} />, c: selected.humidityPct < 25 ? "#f59e0b" : "#3b82f6", a: selected.humidityPct < 25 },
                    { l: "Smoke Index", v: `${selected.smokeIndexPpm} ppm`, i: <Wind size={14} />, c: selected.smokeIndexPpm > 200 ? "#ef4444" : "#8b5cf6", a: selected.smokeIndexPpm > 200 },
                  ].map((m) => (
                    <div key={m.l} className="rounded-2xl p-4 card-hover" style={{ background: m.a ? `${m.c}12` : "var(--bg-card)", border: `1px solid ${m.a ? m.c + "40" : "var(--border)"}` }}>
                      <div className="flex items-center gap-2 mb-2" style={{ color: m.c }}>{m.i}<span className="text-[10px] font-semibold uppercase tracking-wider">{m.l}</span></div>
                      <div className="text-2xl font-black tabular-nums" style={{ color: m.c }}>{m.v}</div>
                      {m.a && <div className="text-[10px] mt-1.5 font-bold" style={{ color: m.c }}>&#x26A0; Threshold exceeded</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl p-6 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                  <WifiOff size={32} style={{ color: "#334a66" }} className="mx-auto mb-2" /><p className="text-sm" style={{ color: "#6b82a0" }}>Sensor offline</p>
                </div>
              )}
            </div>
          ) : <div className="text-center py-8" style={{ color: "#334a66" }}>Select a sensor</div>}
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-5 py-3 flex items-center gap-2 sticky top-0 z-10" style={{ background: "var(--bg-base)", borderBottom: "1px solid var(--border)" }}>
            <Clock size={12} style={{ color: "#f97316" }} /><span className="text-xs font-bold text-white">Incident Timeline</span>
            <span className="ml-auto text-[9px] px-2 py-0.5 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", color: "#334a66", border: "1px solid #16202e" }}>{timeline.length} events &middot; SIMULATED</span>
          </div>
          <div className="p-5 space-y-3 relative">
            <div className="absolute left-[41px] top-5 bottom-5 w-px" style={{ background: "linear-gradient(180deg,#1e2f45,transparent)" }} />
            {timeline.map((ev) => { const color = EC[ev.type] ?? "#6b82a0"; return (
              <div key={ev.id} className="flex items-start gap-3">
                <span className="text-[10px] font-mono w-10 flex-shrink-0 pt-0.5" style={{ color: "#334a66" }}>{ev.time}</span>
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 relative z-10" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white mb-0.5">{ev.label}</div>
                  <div className="text-[11px]" style={{ color: "#5a7090" }}>{ev.detail}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.04)", color: "#334a66", border: "1px solid #16202e" }}>{ev.incidentId}</span>
                    <span className="text-[9px]" style={{ color: "#223040" }}>SIMULATED</span>
                  </div>
                </div>
              </div>
            ); })}
          </div>
        </div>
      </div>
    </div>
  );
}
