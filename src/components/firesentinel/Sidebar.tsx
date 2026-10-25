"use client";
import { Map, LayoutDashboard, Cpu, Navigation, ListChecks, Info, Flame, Activity } from "lucide-react";
import { type NavPage } from "../../lib/firesentinel/types";
import { cn } from "../../lib/utils";

interface NavItem { id: NavPage; label: string; icon: React.ReactNode; badge?: string; dot?: string; }

const NAV_ITEMS: NavItem[] = [
  { id: "overview",            label: "Overview",        icon: <LayoutDashboard size={14} /> },
  { id: "incident_map",        label: "Incident Map",    icon: <Map size={14} />,       badge: "5" },
  { id: "cv_lab",              label: "CV Lab",          icon: <Cpu size={14} /> },
  { id: "drone_simulator",     label: "Drone Sim",       icon: <Navigation size={14} /> },
  { id: "response_priorities", label: "Priorities",      icon: <ListChecks size={14} /> },
  { id: "about",               label: "About",           icon: <Info size={14} /> },
];

export function Sidebar({ activePage, onNavigate }: { activePage: NavPage; onNavigate: (p: NavPage) => void }) {
  return (
    <aside
      className="w-[200px] flex-shrink-0 flex flex-col h-screen sticky top-0"
      style={{
        background: "linear-gradient(180deg, #070b12 0%, #060a10 100%)",
        borderRight: "1px solid #14202e",
      }}
    >
      {/* Logo */}
      <div className="px-4 pt-5 pb-4" style={{ borderBottom: "1px solid #14202e" }}>
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 flex-shrink-0">
            <div className="absolute inset-0 rounded-xl blur-md" style={{ background: "rgba(249,115,22,0.35)" }} />
            <div className="relative w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#1a0a00,#2a1000)", border: "1px solid rgba(249,115,22,0.4)" }}>
              <Flame size={16} className="text-orange-400" />
            </div>
          </div>
          <div>
            <div className="text-sm font-black tracking-tight text-shimmer">FireSentinel</div>
            <div className="text-[9px] mt-0.5" style={{ color: "#334a66" }}>India Wildfire Intel</div>
          </div>
        </div>

        {/* Demo badge */}
        <div className="mt-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
          style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-blink flex-shrink-0" />
          <span className="text-[9px] font-semibold tracking-widest uppercase" style={{ color: "#d97706" }}>Demo Mode</span>
        </div>
      </div>

      {/* Nav section label */}
      <div className="px-4 pt-4 pb-1">
        <span className="text-[9px] font-semibold tracking-widest uppercase" style={{ color: "#223040" }}>Navigation</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto pb-2">
        {NAV_ITEMS.map((item) => {
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group relative overflow-hidden",
                active ? "text-white" : "text-[#4a6080] hover:text-[#8aa0bc]"
              )}
              style={active ? {
                background: "linear-gradient(135deg,rgba(249,115,22,0.12) 0%,rgba(239,68,68,0.07) 100%)",
                border: "1px solid rgba(249,115,22,0.22)",
                boxShadow: "0 2px 16px rgba(249,115,22,0.08)"
              } : { border: "1px solid transparent" }}
            >
              {/* Active accent bar */}
              {active && (
                <div className="absolute inset-y-0 left-0 w-[3px] rounded-r-full"
                  style={{ background: "linear-gradient(180deg,#f97316,#ef4444)" }} />
              )}
              {/* Hover bg */}
              {!active && (
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "rgba(255,255,255,0.02)" }} />
              )}
              <span className={cn("flex-shrink-0 transition-colors", active ? "text-orange-400" : "text-[#2a3f55] group-hover:text-[#4a6080]")}>
                {item.icon}
              </span>
              <span className="text-xs font-medium flex-1 relative z-10">{item.label}</span>
              {item.badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md tabular-nums"
                  style={{ background: "rgba(249,115,22,0.15)", color: "#f97316", border: "1px solid rgba(249,115,22,0.25)" }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System status */}
      <div className="px-3 py-3" style={{ borderTop: "1px solid #14202e" }}>
        <div className="rounded-xl px-3 py-2.5 space-y-2"
          style={{ background: "rgba(11,17,24,0.8)", border: "1px solid #16202e" }}>
          <div className="flex items-center gap-2">
            <Activity size={10} style={{ color: "#22c55e" }} />
            <span className="text-[10px] font-medium" style={{ color: "#22c55e" }}>System Nominal</span>
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          </div>
          <div className="text-[9px] leading-relaxed" style={{ color: "#223040" }}>
            FireSentinel v0.1<br />Student Prototype
          </div>
        </div>
      </div>
    </aside>
  );
}
