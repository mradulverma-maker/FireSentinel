"use client";
interface MetricCardProps {
  label: string;
  value: number | string;
  subtext?: string;
  color?: "amber" | "green" | "red" | "blue";
  icon?: React.ReactNode;
}

const COLORS = {
  amber: { bg: "rgba(180,83,9,0.08)",  border: "rgba(249,115,22,0.2)",  glow: "rgba(249,115,22,0.12)", text: "#f97316", ring: "rgba(249,115,22,0.15)" },
  green: { bg: "rgba(5,100,50,0.08)",  border: "rgba(34,197,94,0.2)",   glow: "rgba(34,197,94,0.1)",   text: "#22c55e", ring: "rgba(34,197,94,0.15)" },
  red:   { bg: "rgba(120,20,20,0.08)", border: "rgba(239,68,68,0.2)",   glow: "rgba(239,68,68,0.1)",   text: "#ef4444", ring: "rgba(239,68,68,0.15)" },
  blue:  { bg: "rgba(10,50,120,0.08)", border: "rgba(59,130,246,0.2)",  glow: "rgba(59,130,246,0.1)",  text: "#3b82f6", ring: "rgba(59,130,246,0.15)" },
};

export function MetricCard({ label, value, subtext, color = "amber", icon }: MetricCardProps) {
  const c = COLORS[color];
  return (
    <div
      className="rounded-2xl p-4 relative overflow-hidden card-hover"
      style={{ background: c.bg, border: `1px solid ${c.border}`, boxShadow: `0 4px 24px ${c.glow}` }}
    >
      {/* Ambient glow blob */}
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl pointer-events-none"
        style={{ background: c.glow, opacity: 0.6 }} />

      <div className="relative flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-semibold tracking-widest uppercase mb-2 truncate"
            style={{ color: c.text, opacity: 0.75 }}>
            {label}
          </div>
          <div className="text-3xl font-black tabular-nums leading-none" style={{ color: c.text }}>
            {value}
          </div>
          {subtext && (
            <div className="text-[10px] mt-1.5 truncate" style={{ color: "#334a66" }}>{subtext}</div>
          )}
        </div>
        {icon && (
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `rgba(255,255,255,0.04)`, border: `1px solid ${c.ring}`, color: c.text }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
