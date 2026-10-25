"use client";
import { type IncidentStatus, type InspectionStatus, type PriorityCategory } from "../../../lib/firesentinel/types";
import { cn } from "../../../lib/utils";

const statusConfig: Record<IncidentStatus, { label: string; color: string }> = {
  candidate: { label: "Candidate", color: "bg-amber-900/60 text-amber-300 border-amber-700/40" },
  under_inspection: { label: "Under Inspection", color: "bg-blue-900/60 text-blue-300 border-blue-700/40" },
  confirmed_hotspot: { label: "Confirmed", color: "bg-red-900/60 text-red-300 border-red-700/40" },
  inspected_supporting: { label: "Supporting Evidence", color: "bg-red-950/60 text-red-400 border-red-800/40" },
  inspected_inconclusive: { label: "Inconclusive", color: "bg-yellow-900/60 text-yellow-300 border-yellow-700/40" },
  low_priority: { label: "Low Priority", color: "bg-neutral-800/60 text-neutral-400 border-neutral-600/40" },
};

const inspectionConfig: Record<InspectionStatus, { label: string; color: string }> = {
  not_started: { label: "Not Started", color: "bg-neutral-800/60 text-neutral-400 border-neutral-600/40" },
  pending: { label: "Pending", color: "bg-blue-900/60 text-blue-300 border-blue-700/40" },
  in_progress: { label: "In Progress", color: "bg-blue-900/60 text-blue-200 border-blue-600/40" },
  complete_supporting: { label: "Complete - Supporting", color: "bg-red-950/60 text-red-300 border-red-700/40" },
  complete_inconclusive: { label: "Complete - Inconclusive", color: "bg-yellow-900/60 text-yellow-300 border-yellow-700/40" },
  failed: { label: "Failed", color: "bg-neutral-800/60 text-neutral-400 border-neutral-600/40" },
};

const priorityConfig: Record<PriorityCategory, { label: string; color: string }> = {
  immediate_review: { label: "Immediate Review", color: "bg-red-900/60 text-red-300 border-red-700/40" },
  prompt_review: { label: "Prompt Review", color: "bg-amber-900/60 text-amber-300 border-amber-700/40" },
  further_assessment: { label: "Further Assessment", color: "bg-yellow-900/60 text-yellow-300 border-yellow-700/40" },
  monitor: { label: "Monitor", color: "bg-blue-900/60 text-blue-300 border-blue-700/40" },
  low_priority: { label: "Low Priority", color: "bg-neutral-800/60 text-neutral-400 border-neutral-600/40" },
};

interface StatusBadgeProps {
  type: "incident" | "inspection" | "priority";
  value: string;
  className?: string;
}

export function StatusBadge({ type, value, className }: StatusBadgeProps) {
  let cfg;
  if (type === "incident") cfg = statusConfig[value as IncidentStatus];
  else if (type === "inspection") cfg = inspectionConfig[value as InspectionStatus];
  else cfg = priorityConfig[value as PriorityCategory];

  if (!cfg) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
        cfg.color,
        className
      )}
    >
      {cfg.label}
    </span>
  );
}
