"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Layers, Navigation, MapPin, Flame, Route,
  Clock, Satellite, ChevronRight, Crosshair, Building2, Zap, Droplets, Info, Radio, Wind, AlertCircle
} from "lucide-react";
import { MOCK_INCIDENTS } from "../../../lib/firesentinel/mockData";
import { StatusBadge } from "../shared/StatusBadge";
import { MapFallback } from "../map/MapFallback";
import type { Incident, NavPage } from "../../../lib/firesentinel/types";

const LeafletMap = dynamic(() => import("../map/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0d1820]">
      <div className="text-center space-y-2">
        <div className="w-6 h-6 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto" />
        <span className="text-xs text-[#4a5568]">Loading map...</span>
      </div>
    </div>
  ),
});

interface IncidentMapPageProps {
  selectedIncidentId: string | null;
  onSelectIncident: (id: string) => void;
  onNavigate: (page: NavPage) => void;
  onLaunchMission: (id: string) => void;
  searchQuery: string;
  missionProgress: number;
}

const ASSET_ICONS: Record<string, React.ReactNode> = {
  settlement: <Building2 size={10} />,
  road: <Route size={10} />,
  water_source: <Droplets size={10} />,
  powerline: <Zap size={10} />,
  reserve: <MapPin size={10} />,
};

export function IncidentMapPage({
  selectedIncidentId,
  onSelectIncident,
  onNavigate,
  onLaunchMission,
  searchQuery,
  missionProgress,
}: IncidentMapPageProps) {
  const [showHotspots, setShowHotspots] = useState(true);
  const [showSensors, setShowSensors] = useState(true);
  const [showPerimeter, setShowPerimeter] = useState(true);
  const [showRiskZone, setShowRiskZone] = useState(true);
  const [showSettlements, setShowSettlements] = useState(true);
  const [showRoads, setShowRoads] = useState(true);
  const [showWind, setShowWind] = useState(true);
  const [showDroneRoute, setShowDroneRoute] = useState(true);
  const [mapError, setMapError] = useState(false);

  const selectedIncident = selectedIncidentId
    ? MOCK_INCIDENTS.find((i) => i.id === selectedIncidentId)
    : null;

  const filtered = MOCK_INCIDENTS.filter(
    (i) =>
      i.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const canLaunch =
    selectedIncident &&
    selectedIncident.inspectionStatus !== "in_progress" &&
    selectedIncident.inspectionStatus !== "complete_supporting" &&
    selectedIncident.inspectionStatus !== "complete_inconclusive";

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left panel - incident list */}
      <div className="w-56 flex-shrink-0 border-r border-[#1e2d3d] flex flex-col bg-[#0d1117]">
        <div className="px-3 py-2.5 border-b border-[#1e2d3d]">
          <span className="text-[10px] text-[#4a5568] uppercase tracking-wider">Incidents (India)</span>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-[#1e2d3d]">
          {filtered.length === 0 && (
            <div className="p-4 text-center text-xs text-[#4a5568]">No incidents match search.</div>
          )}
          {filtered.map((inc) => (
            <button
              key={inc.id}
              onClick={() => onSelectIncident(inc.id)}
              className={`w-full px-3 py-2.5 text-left transition-colors ${
                selectedIncidentId === inc.id
                  ? "bg-[#1a2234] border-l-2 border-green-500"
                  : "hover:bg-[#111827] border-l-2 border-transparent"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  inc.status === "inspected_supporting" ? "bg-red-500" :
                  inc.status === "under_inspection" ? "bg-blue-400" :
                  inc.status === "inspected_inconclusive" ? "bg-yellow-400" :
                  inc.status === "low_priority" ? "bg-neutral-500" : "bg-amber-400"
                }`} />
                <span className="text-xs font-mono font-semibold text-white">{inc.id}</span>
              </div>
              <StatusBadge type="incident" value={inc.status} />
              <div className="text-[10px] text-[#4a5568] mt-1 font-mono">
                {inc.lat.toFixed(3)}, {inc.lng.toFixed(3)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 overflow-hidden" style={{ position: "relative" }}>
        {/* Layer toggles */}
        <div className="absolute top-3 left-3 z-10 bg-[#0d1117]/95 backdrop-blur border border-[#1e2d3d] rounded-lg p-3 space-y-1.5 shadow-xl max-h-[85vh] overflow-y-auto">
          <div className="flex items-center gap-1.5 mb-2 pb-1 border-b border-[#1e2d3d]">
            <Layers size={11} className="text-[#4a5568]" />
            <span className="text-[10px] text-[#8b9bb4] font-medium uppercase tracking-wider">Map Layers</span>
          </div>
          {[
            { label: "Hotspots", value: showHotspots, set: setShowHotspots, icon: <Flame size={10} className="text-orange-500" /> },
            { label: "IoT Sensors", value: showSensors, set: setShowSensors, icon: <Radio size={10} className="text-purple-400" /> },
            { label: "Est. Perimeter", value: showPerimeter, set: setShowPerimeter, icon: <Crosshair size={10} className="text-red-500" /> },
            { label: "Risk Zone", value: showRiskZone, set: setShowRiskZone, icon: <AlertCircle size={10} className="text-amber-500" /> },
            { label: "Settlements", value: showSettlements, set: setShowSettlements, icon: <Building2 size={10} className="text-blue-400" /> },
            { label: "Roads", value: showRoads, set: setShowRoads, icon: <Route size={10} className="text-yellow-400" /> },
            { label: "Wind Direction", value: showWind, set: setShowWind, icon: <Wind size={10} className="text-cyan-400" /> },
            { label: "Drone Route", value: showDroneRoute, set: setShowDroneRoute, icon: <Navigation size={10} className="text-blue-400" /> },
          ].map((layer) => (
            <label key={layer.label} className="flex items-center gap-2 cursor-pointer group hover:bg-[#16202e] p-1 rounded transition-colors">
              <div className={`w-6 h-3.5 rounded-full transition-colors relative ${layer.value ? "bg-green-600" : "bg-[#1e2d3d]"}`}>
                <div className={`w-2.5 h-2.5 bg-white rounded-full absolute top-0.5 transition-transform ${layer.value ? "translate-x-3" : "translate-x-0.5"}`} />
              </div>
              <input type="checkbox" className="hidden" checked={layer.value} onChange={(e) => layer.set(e.target.checked)} />
              <span className="flex-shrink-0">{layer.icon}</span>
              <span className="text-[10px] text-[#8b9bb4] group-hover:text-white transition-colors">{layer.label}</span>
            </label>
          ))}
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 z-10 bg-[#0d1117]/95 backdrop-blur border border-[#1e2d3d] rounded-lg p-3 shadow-xl">
          <span className="text-[10px] text-[#4a5568] uppercase tracking-wider block mb-2 font-bold">Legend</span>
          <div className="space-y-1.5">
            {[
              { color: "bg-amber-500", label: "Candidate" },
              { color: "bg-blue-500", label: "Under Inspection" },
              { color: "bg-red-500", label: "Supporting Evidence" },
              { color: "bg-yellow-500", label: "Inconclusive" },
              { color: "bg-neutral-500", label: "Low Priority" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${l.color}`} />
                <span className="text-[10px] text-[#8b9bb4]">{l.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 pt-1 border-t border-[#1e2d3d]">
              <span className="w-2.5 h-2.5 rounded border border-purple-400 bg-purple-950/80 inline-block" />
              <span className="text-[10px] text-[#8b9bb4]">IoT Node (Sensor)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-500 text-[10px] font-mono">- - -</span>
              <span className="text-[10px] text-[#8b9bb4]">Est. Perimeter</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-orange-400 text-[10px] font-mono">···</span>
              <span className="text-[10px] text-[#8b9bb4]">Projected Risk Zone</span>
            </div>
          </div>
        </div>

        {/* SIMULATED label */}
        <div className="absolute top-3 right-3 z-10 text-[10px] text-[#4a5568] bg-[#0d1117]/80 px-2 py-1 rounded border border-[#1e2d3d]">
          ILLUSTRATIVE MAP DATA
        </div>

        {mapError ? (
          <MapFallback
            incidents={filtered}
            selectedId={selectedIncidentId}
            onSelect={onSelectIncident}
          />
        ) : (
          <LeafletMap
            incidents={filtered}
            selectedIncidentId={selectedIncidentId}
            onSelectIncident={onSelectIncident}
            showHotspots={showHotspots}
            showSensors={showSensors}
            showDroneRoute={showDroneRoute}
            showPerimeter={showPerimeter}
            showRiskZone={showRiskZone}
            showSettlements={showSettlements}
            showRoads={showRoads}
            showWind={showWind}
            missionProgress={missionProgress}
          />
        )}
      </div>

      {/* Right panel - incident detail */}
      <div className="w-72 flex-shrink-0 border-l border-[#1e2d3d] flex flex-col bg-[#0d1117] overflow-y-auto">
        {selectedIncident ? (
          <>
            <div className="px-4 py-3 border-b border-[#1e2d3d]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-mono font-bold text-white">{selectedIncident.id}</span>
                <StatusBadge type="incident" value={selectedIncident.status} />
              </div>
              <StatusBadge type="inspection" value={selectedIncident.inspectionStatus} className="mt-1" />
            </div>

            <div className="p-4 space-y-4 text-xs">
              <div className="space-y-2">
                <Row icon={<MapPin size={10} />} label="Coordinates" value={`${selectedIncident.lat.toFixed(4)}, ${selectedIncident.lng.toFixed(4)}`} mono />
                <Row icon={<Clock size={10} />} label="Detected" value={new Date(selectedIncident.timestamp).toLocaleString()} />
                <Row icon={<Satellite size={10} />} label="Source" value={selectedIncident.source} />
                <Row
                  icon={<Info size={10} />}
                  label="Conf. (Illustrative)"
                  value={`${selectedIncident.illustrativeConfidence}%`}
                  note="Not a calibrated probability"
                />
                {selectedIncident.illustrativeAreaHa && (
                  <Row icon={<Flame size={10} />} label="Est. Area (Illus.)" value={`~${selectedIncident.illustrativeAreaHa} ha`} />
                )}
              </div>

              {/* Description */}
              <div>
                <p className="text-[#8b9bb4] leading-relaxed">{selectedIncident.description}</p>
              </div>

              {/* Nearby assets */}
              <div>
                <div className="text-[10px] text-[#4a5568] uppercase tracking-wider mb-2">Nearby Assets</div>
                <div className="space-y-1.5">
                  {selectedIncident.nearbyAssets.map((asset) => (
                    <div key={asset.id} className="flex items-center gap-2">
                      <span className={`${asset.critical ? "text-blue-400" : "text-[#4a5568]"}`}>
                        {ASSET_ICONS[asset.type]}
                      </span>
                      <span className={`flex-1 ${asset.critical ? "text-[#c8d4e6]" : "text-[#8b9bb4]"}`}>{asset.name}</span>
                      <span className="text-[10px] text-[#4a5568] font-mono">{asset.distanceKm} km</span>
                      {asset.critical && <span className="text-[9px] text-blue-400 bg-blue-950/40 border border-blue-800/30 px-1 py-0.5 rounded">critical</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority factors */}
              <div>
                <div className="text-[10px] text-[#4a5568] uppercase tracking-wider mb-2">Priority Factors</div>
                <ul className="space-y-1">
                  {selectedIncident.priorityFactors.map((f, i) => (
                    <li key={i} className="text-[#8b9bb4] flex gap-1.5">
                      <span className="text-green-600 flex-shrink-0">•</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2 border-t border-[#1e2d3d]">
                <button
                  onClick={() => canLaunch && onLaunchMission(selectedIncident.id)}
                  disabled={!canLaunch}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded text-xs font-semibold transition-all ${
                    canLaunch
                      ? "bg-blue-700/20 border border-blue-700/40 text-blue-300 hover:bg-blue-700/30"
                      : "bg-[#1a2234] border border-[#1e2d3d] text-[#4a5568] cursor-not-allowed"
                  }`}
                >
                  <Navigation size={12} />
                  {canLaunch ? "Launch Simulated Inspection" : "Inspection Unavailable"}
                </button>
                <button
                  onClick={() => { onNavigate("response_priorities"); }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded text-xs text-[#8b9bb4] hover:text-white border border-[#1e2d3d] hover:border-[#2d3f55] transition-colors"
                >
                  <ChevronRight size={12} />
                  View Recommendation
                </button>
                <button
                  onClick={() => { onNavigate("fire_spread"); }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded text-xs text-orange-400 hover:text-orange-300 border border-orange-500/30 hover:border-orange-500/50 transition-colors bg-orange-950/20"
                >
                  <Wind size={12} />
                  Analyze Spread & Community Risk
                </button>
                <p className="text-[10px] text-[#4a5568] text-center">Illustrative confidence values are not calibrated probabilities.</p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <MapPin size={32} className="text-[#2d3f55] mb-3" />
            <p className="text-sm text-[#4a5568]">Select an incident marker to view details</p>
            <p className="text-xs text-[#2d3f55] mt-1">or click on the list to the left</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ icon, label, value, mono, note }: { icon: React.ReactNode; label: string; value: string; mono?: boolean; note?: string }) {
  return (
    <div>
      <div className="flex items-start gap-1.5">
        <span className="text-[#4a5568] flex-shrink-0 mt-0.5">{icon}</span>
        <div className="min-w-0">
          <div className="text-[10px] text-[#4a5568] uppercase tracking-wider">{label}</div>
          <div className={`text-[#c8d4e6] mt-0.5 ${mono ? "font-mono text-[11px]" : ""}`}>{value}</div>
          {note && <div className="text-[10px] text-[#4a5568] italic">{note}</div>}
        </div>
      </div>
    </div>
  );
}
