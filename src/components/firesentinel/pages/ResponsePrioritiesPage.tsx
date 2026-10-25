"use client";
import { useState } from "react";
import {
  AlertTriangle, CheckCircle2, Clock, ChevronRight,
  Building2, Route, Zap, Droplets, MapPin, Info, BookOpen
} from "lucide-react";
import { MOCK_INCIDENTS } from "../../../lib/firesentinel/mockData";
import { getRecommendation, getPriorityColor, getPriorityBg, RULE_DESCRIPTIONS } from "../../../lib/firesentinel/ruleEngine";
import { StatusBadge } from "../shared/StatusBadge";
import type { Incident, NavPage } from "../../../lib/firesentinel/types";

interface ResponsePrioritiesPageProps {
  selectedIncidentId: string | null;
  onSelectIncident: (id: string) => void;
  onNavigate: (page: NavPage) => void;
  searchQuery: string;
}

const ASSET_ICONS: Record<string, React.ReactNode> = {
  settlement: <Building2 size={10} />,
  road: <Route size={10} />,
  water_source: <Droplets size={10} />,
  powerline: <Zap size={10} />,
  reserve: <MapPin size={10} />,
};

export function ResponsePrioritiesPage({ selectedIncidentId, onSelectIncident, onNavigate, searchQuery }: ResponsePrioritiesPageProps) {
  const [showRules, setShowRules] = useState(false);

  const filtered = MOCK_INCIDENTS.filter(
    (i) =>
      i.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedIncident = selectedIncidentId ? MOCK_INCIDENTS.find((i) => i.id === selectedIncidentId) : null;
  const recommendation = selectedIncident ? getRecommendation(selectedIncident) : null;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Incident list */}
      <div className="w-64 flex-shrink-0 border-r border-[#1e2d3d] flex flex-col bg-[#0d1117]">
        <div className="px-3 py-2.5 border-b border-[#1e2d3d] flex items-center justify-between">
          <span className="text-[10px] text-[#4a5568] uppercase tracking-wider">Incidents</span>
          <button
            onClick={() => setShowRules((v) => !v)}
            className="flex items-center gap-1 text-[10px] text-[#4a5568] hover:text-[#8b9bb4] transition-colors"
          >
            <BookOpen size={10} /> Rules
          </button>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-[#1e2d3d]">
          {filtered.length === 0 && (
            <div className="p-4 text-center text-xs text-[#4a5568]">No incidents match search.</div>
          )}
          {filtered.map((inc) => {
            const rec = getRecommendation(inc);
            return (
              <button
                key={inc.id}
                onClick={() => onSelectIncident(inc.id)}
                className={`w-full px-3 py-3 text-left transition-colors ${
                  selectedIncidentId === inc.id
                    ? "bg-[#1a2234] border-l-2 border-green-500"
                    : "hover:bg-[#111827] border-l-2 border-transparent"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono font-semibold text-white">{inc.id}</span>
                  <span className={`text-[10px] font-semibold ${getPriorityColor(rec.category)}`}>
                    {rec.category === "immediate_review" ? "IMMEDIATE" :
                     rec.category === "prompt_review" ? "PROMPT" :
                     rec.category === "further_assessment" ? "ASSESS" :
                     rec.category === "monitor" ? "MONITOR" : "LOW"}
                  </span>
                </div>
                <StatusBadge type="incident" value={inc.status} />
                <StatusBadge type="inspection" value={inc.inspectionStatus} className="mt-1 ml-0" />
                {inc.illustrativeAreaHa && (
                  <div className="text-[10px] text-[#4a5568] mt-1">~{inc.illustrativeAreaHa} ha (illus.)</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {showRules && (
          <div className="bg-[#161d2a] border border-[#1e2d3d] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[#1e2d3d] flex items-center gap-2">
              <BookOpen size={12} className="text-[#4a5568]" />
              <span className="text-xs font-semibold text-white">Rule Engine Documentation</span>
              <span className="ml-auto text-[10px] text-[#4a5568]">Not a validated emergency model</span>
            </div>
            <div className="p-4 space-y-2">
              {RULE_DESCRIPTIONS.map((rule) => (
                <div key={rule.id} className="flex gap-3 bg-[#111827] border border-[#1e2d3d] rounded p-2.5">
                  <span className="text-[10px] font-mono text-green-500 flex-shrink-0 font-bold mt-0.5">{rule.id}</span>
                  <div>
                    <div className="text-xs font-medium text-[#c8d4e6] mb-0.5">{rule.label}</div>
                    <div className="text-[10px] text-[#8b9bb4]">{rule.description}</div>
                    <div className={`text-[10px] mt-1 font-semibold ${getPriorityColor(rule.action as never)}`}>
                      &#x2192; {rule.action.replace(/_/g, " ")}
                    </div>
                  </div>
                </div>
              ))}
              <p className="text-[10px] text-[#4a5568] italic pt-1">
                These rules are illustrative and for demonstration only. Do not use for actual emergency response decisions.
              </p>
            </div>
          </div>
        )}

        {!selectedIncident ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <CheckCircle2 size={40} className="text-[#2d3f55] mb-4" />
            <p className="text-sm text-[#4a5568]">Select an incident to view its recommendation</p>
          </div>
        ) : recommendation ? (
          <>
            {/* Recommendation header */}
            <div className={`border rounded-lg p-4 ${getPriorityBg(recommendation.category)}`}>
              <div className="flex items-center gap-2 mb-2">
                {recommendation.category === "immediate_review" && <AlertTriangle size={16} className="text-red-400" />}
                {recommendation.category === "prompt_review" && <AlertTriangle size={16} className="text-amber-400" />}
                {recommendation.category === "further_assessment" && <Clock size={16} className="text-yellow-400" />}
                {recommendation.category === "monitor" && <Info size={16} className="text-blue-400" />}
                {recommendation.category === "low_priority" && <CheckCircle2 size={16} className="text-neutral-400" />}
                <span className={`text-base font-bold ${getPriorityColor(recommendation.category)}`}>
                  {recommendation.headline}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-white">{selectedIncident.id}</span>
                <StatusBadge type="incident" value={selectedIncident.status} />
              </div>
              <p className="text-[10px] text-[#8b9bb4] mt-2">
                This recommendation is generated by an illustrative rule engine. Not a validated emergency-risk model.
                Requires human review before any operational decision.
              </p>
            </div>

            {/* Rationale */}
            <div className="bg-[#161d2a] border border-[#1e2d3d] rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#1e2d3d]">
                <span className="text-xs font-semibold text-white">Contributing Factors</span>
              </div>
              <div className="p-4">
                <ul className="space-y-1.5">
                  {recommendation.rationale.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#8b9bb4]">
                      <CheckCircle2 size={12} className="text-green-600 flex-shrink-0 mt-0.5" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Uncertainties */}
            <div className="bg-[#161d2a] border border-[#1e2d3d] rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#1e2d3d]">
                <span className="text-xs font-semibold text-white">Missing or Uncertain Evidence</span>
              </div>
              <div className="p-4">
                <ul className="space-y-1.5">
                  {recommendation.uncertainties.map((u, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#8b9bb4]">
                      <AlertTriangle size={12} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      {u}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Relevant assets */}
            {recommendation.relevantAssets.length > 0 && (
              <div className="bg-[#161d2a] border border-[#1e2d3d] rounded-lg overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[#1e2d3d]">
                  <span className="text-xs font-semibold text-white">Relevant Nearby Assets</span>
                </div>
                <div className="p-4 space-y-2">
                  {recommendation.relevantAssets.map((asset) => (
                    <div key={asset.id} className="flex items-center gap-2">
                      <span className={asset.critical ? "text-blue-400" : "text-[#4a5568]"}>{ASSET_ICONS[asset.type]}</span>
                      <span className={`text-xs flex-1 ${asset.critical ? "text-[#c8d4e6]" : "text-[#8b9bb4]"}`}>{asset.name}</span>
                      <span className="text-[10px] text-[#4a5568] font-mono">{asset.distanceKm} km</span>
                      {asset.critical && <span className="text-[9px] text-blue-400 bg-blue-950/40 border border-blue-800/30 px-1 py-0.5 rounded">critical</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next step */}
            <div className="bg-[#161d2a] border border-[#1e2d3d] rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#1e2d3d]">
                <span className="text-xs font-semibold text-white">Suggested Next Step</span>
              </div>
              <div className="p-4">
                <p className="text-xs text-[#8b9bb4]">{recommendation.suggestedNextStep}</p>
              </div>
            </div>

            {/* Navigate to map */}
            <button
              onClick={() => onNavigate("incident_map")}
              className="flex items-center gap-2 text-xs text-[#8b9bb4] hover:text-white border border-[#1e2d3d] hover:border-[#2d3f55] px-4 py-2 rounded transition-colors"
            >
              <ChevronRight size={12} /> View on Incident Map
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
