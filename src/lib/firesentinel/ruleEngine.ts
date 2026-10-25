import type { Incident, PriorityCategory, RecommendationResult } from "./types";

export const RULE_DESCRIPTIONS = [
  { id: "R1", label: "Supporting evidence + critical asset", action: "immediate_review", description: "Inspection returned supporting visual evidence AND a critical asset is within 2 km." },
  { id: "R2", label: "Supporting evidence, no critical asset nearby", action: "prompt_review", description: "Inspection returned supporting visual evidence but no critical asset is within 2 km." },
  { id: "R3", label: "Under inspection or pending", action: "further_assessment", description: "Inspection is in progress or not yet initiated. Await results." },
  { id: "R4", label: "Inconclusive inspection + critical asset", action: "prompt_review", description: "Inspection result was inconclusive but a critical asset is within 2 km." },
  { id: "R5", label: "Inconclusive inspection, no critical asset", action: "further_assessment", description: "Inspection result was inconclusive and no critical asset is nearby." },
  { id: "R6", label: "Low-confidence candidate", action: "monitor", description: "Low illustrative confidence value and no inspection evidence." },
  { id: "R7", label: "Low priority", action: "low_priority", description: "Incident status is explicitly low priority." },
];

const PRIORITY_LABELS: Record<PriorityCategory, string> = {
  immediate_review: "Immediate Human Review",
  prompt_review: "Prompt Human Review",
  further_assessment: "Further Assessment Required",
  monitor: "Monitor",
  low_priority: "Low Priority",
};

export function getRecommendation(incident: Incident): RecommendationResult {
  const criticalNearby = incident.nearbyAssets.filter((a) => a.critical && a.distanceKm <= 2.0);
  const hasSupporting = incident.inspectionStatus === "complete_supporting";
  const hasInconclusive = incident.inspectionStatus === "complete_inconclusive";
  const isPending = ["not_started", "in_progress", "pending"].includes(incident.inspectionStatus);
  const isLowPriority = incident.status === "low_priority";

  let category: PriorityCategory;
  let rationale: string[] = [];
  let uncertainties: string[] = [];
  let suggestedNextStep = "";

  if (isLowPriority) {
    category = "low_priority";
    rationale = ["Incident is classified as low priority based on available data.", ...incident.priorityFactors];
    uncertainties = ["Low-confidence satellite signal - may be agricultural activity."];
    suggestedNextStep = "Continue satellite monitoring. No immediate drone re-inspection required.";
  } else if (hasSupporting && criticalNearby.length > 0) {
    category = "immediate_review";
    rationale = ["Simulated inspection returned supporting visual evidence.", `${criticalNearby.length} critical asset(s) within 2 km: ${criticalNearby.map((a) => a.name).join(", ")}.`, ...incident.priorityFactors];
    uncertainties = ["Illustrative confidence values are not calibrated probabilities.", "Simulated imagery - real inspection results may differ."];
    suggestedNextStep = "Escalate to human incident controller immediately. Dispatch ground crew to verify perimeter. Notify asset owners.";
  } else if (hasSupporting) {
    category = "prompt_review";
    rationale = ["Simulated inspection returned supporting visual evidence.", "No critical assets within 2 km.", ...incident.priorityFactors];
    uncertainties = ["Illustrative confidence values are not calibrated probabilities.", "Simulated imagery - real inspection results may differ."];
    suggestedNextStep = "Assign human reviewer within the hour. Consider ground crew dispatch if conditions deteriorate.";
  } else if (hasInconclusive && criticalNearby.length > 0) {
    category = "prompt_review";
    rationale = ["Inspection result was inconclusive (cloud cover in simulated sample).", `Critical asset(s) within 2 km: ${criticalNearby.map((a) => a.name).join(", ")}.`, ...incident.priorityFactors];
    uncertainties = ["Inspection evidence is insufficient to confirm or deny.", "Asset proximity elevates caution despite ambiguity."];
    suggestedNextStep = "Schedule repeat drone inspection. Notify relevant asset authorities. Do not dismiss without further data.";
  } else if (hasInconclusive) {
    category = "further_assessment";
    rationale = ["Inspection result was inconclusive.", "No critical assets within immediate proximity.", ...incident.priorityFactors];
    uncertainties = ["Simulated inspection imagery was ambiguous.", "Cannot confirm or rule out a hotspot from available evidence."];
    suggestedNextStep = "Schedule a follow-up drone inspection at next opportunity. Continue satellite monitoring.";
  } else if (isPending) {
    category = "further_assessment";
    rationale = ["No completed inspection data available yet.", ...incident.priorityFactors];
    uncertainties = ["Outcome depends on inspection results.", "Do not draw conclusions from satellite signal alone."];
    suggestedNextStep = "Await inspection completion. Initiate simulated drone inspection from the Incident Map if not yet launched.";
  } else {
    category = "monitor";
    rationale = ["Low illustrative confidence value.", ...incident.priorityFactors];
    uncertainties = ["Insufficient data to characterise this candidate."];
    suggestedNextStep = "Monitor via next satellite pass. Initiate inspection if signal strengthens.";
  }

  return {
    category,
    headline: PRIORITY_LABELS[category],
    rationale,
    uncertainties,
    suggestedNextStep,
    relevantAssets: criticalNearby.length > 0 ? criticalNearby : incident.nearbyAssets.slice(0, 2),
  };
}

export function getPriorityColor(category: PriorityCategory): string {
  switch (category) {
    case "immediate_review": return "text-red-400";
    case "prompt_review": return "text-amber-400";
    case "further_assessment": return "text-yellow-300";
    case "monitor": return "text-blue-400";
    case "low_priority": return "text-neutral-400";
    default: return "text-neutral-400";
  }
}

export function getPriorityBg(category: PriorityCategory): string {
  switch (category) {
    case "immediate_review": return "bg-red-950/60 border-red-800/40";
    case "prompt_review": return "bg-amber-950/60 border-amber-800/40";
    case "further_assessment": return "bg-yellow-950/60 border-yellow-800/40";
    case "monitor": return "bg-blue-950/60 border-blue-800/40";
    case "low_priority": return "bg-neutral-900/60 border-neutral-700/40";
    default: return "bg-neutral-900/60 border-neutral-700/40";
  }
}
