"use client";
import { useState } from "react";
import { Bell, Shield, CheckCircle2, XCircle, Eye, FileText, AlertTriangle, Clock, Users, ChevronRight } from "lucide-react";
import type { WarningStatus, WarningDraft } from "../../../lib/firesentinel/types";
import { INITIAL_WARNING_DRAFT, MOCK_COMMUNITIES } from "../../../lib/firesentinel/mockData";

const STATUS_CFG: Record<WarningStatus, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  draft:               { label: "Draft",                color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.25)", icon: <FileText size={12} /> },
  awaiting_review:     { label: "Awaiting Authority Review", color: "#3b82f6", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.25)", icon: <Clock size={12} /> },
  approved_simulation: { label: "Approved (Simulation)", color: "#22c55e", bg: "rgba(34,197,94,0.1)",  border: "rgba(34,197,94,0.25)",  icon: <CheckCircle2 size={12} /> },
  closed:              { label: "Closed",               color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.25)", icon: <XCircle size={12} /> },
};

const FLOW: WarningStatus[] = ["draft", "awaiting_review", "approved_simulation", "closed"];

export function EarlyWarningPage() {
  const [warning, setWarning] = useState<WarningDraft>(INITIAL_WARNING_DRAFT);
  const [showPreview, setShowPreview] = useState(false);

  const sc = STATUS_CFG[warning.status];
  const currentIdx = FLOW.indexOf(warning.status);
  const canAdvance = currentIdx < FLOW.length - 1;

  const advanceStatus = () => {
    if (!canAdvance) return;
    setWarning((p) => ({ ...p, status: FLOW[currentIdx + 1] }));
  };

  const toggleCheck = (idx: number) => {
    setWarning((p) => ({
      ...p,
      reviewChecklist: p.reviewChecklist.map((c, i) => i === idx ? { ...c, checked: !c.checked } : c),
    }));
  };

  const checkedCount = warning.reviewChecklist.filter((c) => c.checked).length;
  const totalCount = warning.reviewChecklist.length;

  return (
    <div className="flex h-full overflow-hidden" style={{ background: "var(--bg-base)" }}>
      {/* Left: warning detail */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Disclaimer */}
        <div className="px-5 py-2.5 flex items-center gap-2 flex-shrink-0" style={{ background: "rgba(249,115,22,0.06)", borderBottom: "1px solid rgba(249,115,22,0.15)" }}>
          <AlertTriangle size={11} className="text-amber-500 flex-shrink-0" />
          <p className="text-[10px]" style={{ color: "#d97706" }}><strong>Simulated demonstration.</strong> This does not send real alerts, contact people, or integrate with emergency systems.</p>
        </div>

        <div className="p-5 space-y-5 flex-1">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)" }}>
                <Bell size={18} style={{ color: "#ef4444" }} />
              </div>
              <div>
                <h2 className="text-base font-black text-white">Community Early-Warning Center</h2>
                <p className="text-[11px]" style={{ color: "#6b82a0" }}>Warning {warning.id} &middot; Linked to {warning.incidentId}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: sc.bg, border: `1px solid ${sc.border}` }}>
              <span style={{ color: sc.color }}>{sc.icon}</span>
              <span className="text-xs font-bold" style={{ color: sc.color }}>{sc.label}</span>
            </div>
          </div>

          {/* Status flow */}
          <div className="rounded-2xl p-4 card-hover" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#334a66" }}>Warning Lifecycle (Simulated)</div>
            <div className="flex items-center gap-1">
              {FLOW.map((s, i) => {
                const cfg = STATUS_CFG[s]; const active = warning.status === s; const done = i < currentIdx;
                return (
                  <div key={s} className="flex items-center gap-1 flex-1">
                    <div className="flex-1 rounded-xl px-3 py-2 text-center transition-all"
                      style={{ background: active ? cfg.bg : done ? `${cfg.color}08` : "rgba(255,255,255,0.02)", border: `1px solid ${active ? cfg.border : done ? `${cfg.color}15` : "#16202e"}` }}>
                      <div className="text-[9px] font-bold" style={{ color: active ? cfg.color : done ? `${cfg.color}80` : "#334a66" }}>{cfg.label}</div>
                    </div>
                    {i < FLOW.length - 1 && <ChevronRight size={10} style={{ color: "#1e2f45" }} className="flex-shrink-0" />}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={advanceStatus} disabled={!canAdvance}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all"
                style={canAdvance ? { background: "linear-gradient(135deg,rgba(59,130,246,0.15),rgba(34,197,94,0.1))", border: "1px solid rgba(59,130,246,0.3)", color: "#93c5fd" }
                  : { background: "rgba(255,255,255,0.03)", border: "1px solid #16202e", color: "#334a66" }}>
                <Shield size={12} /> {canAdvance ? `Advance to ${STATUS_CFG[FLOW[currentIdx + 1]].label}` : "Workflow Complete"}
              </button>
              <button onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 rounded-xl py-2.5 text-xs font-bold transition-all"
                style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", color: "#f97316" }}>
                <Eye size={12} /> {showPreview ? "Hide" : "Preview"} Warning
              </button>
            </div>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="rounded-2xl overflow-hidden animate-fade-up" style={{ border: "2px solid rgba(239,68,68,0.3)", boxShadow: "0 0 24px rgba(239,68,68,0.1)" }}>
              <div className="px-5 py-3 flex items-center gap-2" style={{ background: "rgba(239,68,68,0.1)", borderBottom: "1px solid rgba(239,68,68,0.2)" }}>
                <AlertTriangle size={14} style={{ color: "#ef4444" }} />
                <span className="text-sm font-black" style={{ color: "#fca5a5" }}>COMMUNITY ADVISORY &mdash; SIMULATED</span>
              </div>
              <div className="p-5 space-y-4" style={{ background: "#0d1118" }}>
                <div><div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#ef4444" }}>Title</div><div className="text-sm font-bold text-white">{warning.title}</div></div>
                <div><div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#f97316" }}>Affected Area</div><div className="text-sm" style={{ color: "#6b82a0" }}>{warning.affectedArea}</div></div>
                <div><div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#f59e0b" }}>Reason</div><div className="text-sm leading-relaxed" style={{ color: "#6b82a0" }}>{warning.reason}</div></div>
                <div><div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#22c55e" }}>Recommended Action</div><div className="text-sm leading-relaxed" style={{ color: "#6b82a0" }}>{warning.recommendedAction}</div></div>
                <div className="pt-2 text-[10px] italic" style={{ color: "#334a66", borderTop: "1px solid #16202e" }}>This warning is a SIMULATED demonstration. No real alert will be sent.</div>
              </div>
            </div>
          )}

          {/* Warning details grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Checklist */}
            <div className="rounded-2xl overflow-hidden card-hover" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.015)" }}>
                <span className="text-xs font-bold text-white">Responder Review Checklist</span>
                <span className="text-[10px] font-bold tabular-nums" style={{ color: checkedCount === totalCount ? "#22c55e" : "#f59e0b" }}>{checkedCount}/{totalCount}</span>
              </div>
              <div className="p-3 space-y-1.5">
                {warning.reviewChecklist.map((c, i) => (
                  <button key={i} onClick={() => toggleCheck(i)} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left"
                    style={{ background: c.checked ? "rgba(34,197,94,0.05)" : "rgba(255,255,255,0.02)", border: `1px solid ${c.checked ? "rgba(34,197,94,0.15)" : "#16202e"}` }}>
                    <div className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={c.checked ? { background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.4)" } : { background: "rgba(255,255,255,0.04)", border: "1px solid #1e2f45" }}>
                      {c.checked && <CheckCircle2 size={12} style={{ color: "#22c55e" }} />}
                    </div>
                    <span className="text-xs" style={{ color: c.checked ? "#6b82a0" : "#e4edf8", textDecoration: c.checked ? "line-through" : undefined }}>{c.item}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Communities */}
            <div className="rounded-2xl overflow-hidden card-hover" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.015)" }}>
                <Users size={12} style={{ color: "#f97316" }} /><span className="text-xs font-bold text-white">Potentially Affected Communities</span>
              </div>
              <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                {MOCK_COMMUNITIES.filter((c) => c.inZone || c.nearZone).map((c) => (
                  <div key={c.id} className="flex items-center gap-3 px-4 py-3">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.inZone ? "#ef4444" : "#f59e0b", boxShadow: c.inZone ? "0 0 6px #ef4444" : undefined }} />
                    <div className="flex-1 min-w-0"><div className="text-xs font-semibold text-white">{c.name}</div><div className="text-[10px]" style={{ color: "#334a66" }}>Pop. ~{c.population} &middot; {c.distanceKm} km</div></div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg"
                      style={c.inZone ? { background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }
                        : { background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", color: "#fcd34d" }}>
                      {c.inZone ? "In zone" : "Near zone"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-3"><p className="text-[9px]" style={{ color: "#223040" }}>Community data is simulated. No real population counts.</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: info sidebar */}
      <div className="w-64 flex-shrink-0 flex flex-col overflow-y-auto" style={{ borderLeft: "1px solid var(--border)" }}>
        <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.015)" }}>
          <span className="text-xs font-bold text-white">Warning Details</span>
        </div>
        <div className="p-4 space-y-4">
          {[
            { l: "Warning ID", v: warning.id },
            { l: "Incident", v: warning.incidentId },
            { l: "Created", v: new Date(warning.createdAt).toLocaleString() },
            { l: "Status", v: sc.label },
          ].map((r) => (
            <div key={r.l}><div className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: "#334a66" }}>{r.l}</div><div className="text-xs font-mono" style={{ color: "#e4edf8" }}>{r.v}</div></div>
          ))}
          <div className="pt-3" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: "#334a66" }}>Checklist Progress</div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "#0d1520" }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${(checkedCount / totalCount) * 100}%`, background: checkedCount === totalCount ? "#22c55e" : "#f59e0b", boxShadow: `0 0 8px ${checkedCount === totalCount ? "#22c55e" : "#f59e0b"}80` }} />
            </div>
            <div className="text-[10px] mt-1 tabular-nums" style={{ color: "#6b82a0" }}>{checkedCount} of {totalCount} items</div>
          </div>
          <div className="pt-3 space-y-2" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: "#334a66" }}>Key Disclaimers</div>
            {["No real alerts sent", "No government integration", "Simulated data only", "For demonstration purposes"].map((d) => (
              <div key={d} className="flex items-center gap-1.5"><AlertTriangle size={9} style={{ color: "#f59e0b" }} /><span className="text-[10px]" style={{ color: "#6b82a0" }}>{d}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
