"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Navigation, CheckCircle2, MapPin, Clock, Battery, Gauge,
  RotateCcw, PlayCircle, AlertTriangle, ChevronRight, Plane
} from "lucide-react";
import { MOCK_INCIDENTS, getIncidentById } from "../../../lib/firesentinel/mockData";
import { StatusBadge } from "../shared/StatusBadge";
import type { MissionPhase, NavPage } from "../../../lib/firesentinel/types";

interface DroneSimulatorPageProps {
  selectedIncidentId: string | null;
  onSelectIncident: (id: string) => void;
  onNavigate: (page: NavPage) => void;
  externalMissionPhase: MissionPhase;
  onMissionPhaseChange: (phase: MissionPhase) => void;
}

const PHASE_STEPS: { phase: MissionPhase; label: string; duration: number }[] = [
  { phase: "planned", label: "Mission Planned", duration: 3000 },
  { phase: "en_route", label: "Drone En Route", duration: 6000 },
  { phase: "inspecting", label: "Inspecting Location", duration: 5000 },
  { phase: "complete", label: "Inspection Complete", duration: 2000 },
  { phase: "assessment_available", label: "Assessment Available", duration: 0 },
];

export function DroneSimulatorPage({
  selectedIncidentId,
  onSelectIncident,
  onNavigate,
  externalMissionPhase,
  onMissionPhaseChange,
}: DroneSimulatorPageProps) {
  const [phase, setPhase] = useState<MissionPhase>(externalMissionPhase);
  const [elapsed, setElapsed] = useState(0);
  const [altitude, setAltitude] = useState(0);
  const [battery, setBattery] = useState(100);
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const incident = selectedIncidentId ? getIncidentById(selectedIncidentId) : null;

  // Sync external phase
  useEffect(() => {
    if (externalMissionPhase !== "idle" && externalMissionPhase !== phase) {
      setPhase(externalMissionPhase);
    }
  }, [externalMissionPhase]);

  // Timer
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const el = Math.floor((now - (startTime ?? now)) / 1000);
      setElapsed(el);
      setAltitude(phase === "en_route" ? 80 + Math.sin(el * 0.5) * 5 : phase === "inspecting" ? 45 + Math.sin(el) * 3 : 0);
      setBattery(Math.max(20, 100 - el * 0.8));
      setProgress(Math.min(100, (el / 18) * 100));
    }, 500);
    return () => clearInterval(interval);
  }, [running, startTime, phase]);

  const launchMission = useCallback(() => {
    if (!incident || running) return;
    setPhase("planned");
    setRunning(true);
    setStartTime(Date.now());
    setElapsed(0);
    setBattery(100);
    setProgress(0);
    onMissionPhaseChange("planned");

    let delay = 0;
    PHASE_STEPS.forEach((step, i) => {
      if (i === 0) return;
      delay += PHASE_STEPS[i - 1].duration;
      setTimeout(() => {
        setPhase(step.phase);
        onMissionPhaseChange(step.phase);
        if (step.duration === 0) {
          setRunning(false);
        }
      }, delay);
    });
  }, [incident, running, onMissionPhaseChange]);

  const resetMission = useCallback(() => {
    setPhase("idle");
    setRunning(false);
    setElapsed(0);
    setAltitude(0);
    setBattery(100);
    setProgress(0);
    onMissionPhaseChange("idle");
  }, [onMissionPhaseChange]);

  const phaseIdx = PHASE_STEPS.findIndex((s) => s.phase === phase);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: incident selector */}
      <div className="w-56 flex-shrink-0 border-r border-[#1e2d3d] flex flex-col bg-[#0d1117]">
        <div className="px-3 py-2.5 border-b border-[#1e2d3d]">
          <span className="text-[10px] text-[#4a5568] uppercase tracking-wider">Select Incident</span>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-[#1e2d3d]">
          {MOCK_INCIDENTS.map((inc) => {
            const canLaunch = inc.inspectionStatus !== "complete_supporting" && inc.inspectionStatus !== "complete_inconclusive" && inc.inspectionStatus !== "in_progress";
            return (
              <button
                key={inc.id}
                onClick={() => { if (canLaunch) { onSelectIncident(inc.id); resetMission(); } }}
                className={`w-full px-3 py-2.5 text-left transition-colors ${
                  selectedIncidentId === inc.id ? "bg-[#1a2234] border-l-2 border-blue-500" : "hover:bg-[#111827] border-l-2 border-transparent"
                } ${!canLaunch ? "opacity-50" : ""}`}
              >
                <div className="text-xs font-mono font-semibold text-white mb-1">{inc.id}</div>
                <StatusBadge type="inspection" value={inc.inspectionStatus} />
                {!canLaunch && <div className="text-[10px] text-[#4a5568] mt-1">Already inspected</div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {!incident ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Navigation size={40} className="text-[#2d3f55] mb-4" />
            <p className="text-sm text-[#4a5568]">Select an incident to launch a simulated inspection</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white font-mono">Simulated Mission: {incident.id}</h2>
                <p className="text-xs text-[#4a5568] mt-0.5">All telemetry is SIMULATED. No real drone is involved.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={resetMission}
                  className="flex items-center gap-1.5 text-xs border border-[#1e2d3d] text-[#8b9bb4] px-3 py-1.5 rounded hover:bg-[#111827] transition-colors"
                >
                  <RotateCcw size={11} /> Reset
                </button>
                <button
                  onClick={launchMission}
                  disabled={running || phase === "assessment_available"}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded font-semibold transition-all ${
                    running || phase === "assessment_available"
                      ? "bg-[#1a2234] border border-[#1e2d3d] text-[#4a5568] cursor-not-allowed"
                      : "bg-blue-700/20 border border-blue-700/40 text-blue-300 hover:bg-blue-700/30"
                  }`}
                >
                  <PlayCircle size={11} /> Launch Mission
                </button>
              </div>
            </div>

            {/* Progress steps */}
            <div className="bg-[#161d2a] border border-[#1e2d3d] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#8b9bb4] font-medium">Mission Progress</span>
                <span className="text-[10px] text-[#4a5568] font-mono">{progress.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 bg-[#1a2234] rounded-full mb-4 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center gap-0">
                {PHASE_STEPS.map((step, i) => {
                  const done = phaseIdx > i;
                  const active = phaseIdx === i && phase !== "idle";
                  return (
                    <div key={step.phase} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center gap-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                          done ? "bg-blue-600 text-white" :
                          active ? "bg-blue-500 text-white ring-2 ring-blue-400/40" :
                          "bg-[#1a2234] text-[#4a5568]"
                        }`}>
                          {done ? <CheckCircle2 size={12} /> : i + 1}
                        </div>
                        <span className={`text-[9px] text-center leading-tight max-w-[60px] ${active ? "text-blue-300" : done ? "text-[#8b9bb4]" : "text-[#4a5568]"}`}>
                          {step.label}
                        </span>
                      </div>
                      {i < PHASE_STEPS.length - 1 && (
                        <div className={`flex-1 h-px mx-1 mt-[-12px] transition-colors ${done ? "bg-blue-600" : "bg-[#1e2d3d]"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Telemetry panel */}
            {phase !== "idle" && (
              <div className="bg-[#161d2a] border border-[#1e2d3d] rounded-lg overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[#1e2d3d] flex items-center gap-2">
                  <Plane size={12} className={`${running ? "text-blue-400 animate-pulse" : "text-[#4a5568]"}`} />
                  <span className="text-xs font-semibold text-white">Drone Telemetry</span>
                  <span className="ml-auto text-[10px] text-amber-400 bg-amber-950/40 border border-amber-800/30 px-1.5 py-0.5 rounded">SIMULATED</span>
                </div>
                <div className="grid grid-cols-3 divide-x divide-[#1e2d3d]">
                  <TelemetryCell
                    icon={<Clock size={12} />}
                    label="Elapsed"
                    value={`${Math.floor(elapsed / 60).toString().padStart(2, "0")}:${(elapsed % 60).toString().padStart(2, "0")}`}
                  />
                  <TelemetryCell
                    icon={<Gauge size={12} />}
                    label="Altitude"
                    value={`${altitude.toFixed(0)}m`}
                  />
                  <TelemetryCell
                    icon={<Battery size={12} />}
                    label="Battery"
                    value={`${battery.toFixed(0)}%`}
                    warn={battery < 40}
                  />
                </div>
              </div>
            )}

            {/* Mission Timeline */}
            <div className="bg-[#161d2a] border border-[#1e2d3d] rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#1e2d3d]">
                <span className="text-xs font-semibold text-white">Mission Timeline</span>
              </div>
              <div className="p-4 space-y-2">
                {PHASE_STEPS.map((step, i) => {
                  const done = phaseIdx > i;
                  const active = phaseIdx === i && phase !== "idle";
                  return (
                    <div key={step.phase} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        done ? "bg-blue-600" : active ? "bg-blue-500 ring-2 ring-blue-400/30" : "bg-[#1a2234]"
                      }`}>
                        {done ? <CheckCircle2 size={10} className="text-white" /> :
                         active ? <div className="w-2 h-2 bg-white rounded-full animate-pulse" /> :
                         <div className="w-2 h-2 rounded-full bg-[#4a5568]" />}
                      </div>
                      <div>
                        <div className={`text-xs font-medium ${active ? "text-blue-300" : done ? "text-[#8b9bb4]" : "text-[#4a5568]"}`}>
                          {step.label}
                        </div>
                        {active && (
                          <div className="text-[10px] text-[#4a5568] mt-0.5">In progress... (simulated)</div>
                        )}
                        {done && step.phase === "inspecting" && (
                          <div className="text-[10px] text-green-500 mt-0.5">Sample imagery captured</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sample inspection image */}
            {(phase === "complete" || phase === "assessment_available") && (
              <div className="bg-[#161d2a] border border-[#1e2d3d] rounded-lg overflow-hidden">
                <div className="px-4 py-2.5 border-b border-[#1e2d3d] flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">Sample Inspection Imagery</span>
                  <span className="ml-auto text-[10px] text-amber-400 bg-amber-950/40 border border-amber-800/30 px-1.5 py-0.5 rounded">ILLUSTRATIVE</span>
                </div>
                <div className="p-4">
                  <AerialImagePlaceholder />
                  <p className="text-[10px] text-[#4a5568] mt-2 text-center">
                    Sample aerial imagery for demonstration. Not a real drone photograph.
                  </p>
                </div>
              </div>
            )}

            {/* Assessment CTA */}
            {phase === "assessment_available" && (
              <div className="bg-green-950/30 border border-green-800/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={14} className="text-green-400" />
                  <span className="text-sm font-semibold text-green-300">Assessment Available</span>
                </div>
                <p className="text-xs text-[#8b9bb4] mb-3">
                  The simulated inspection is complete. View the rule-based response recommendation for this incident.
                </p>
                <button
                  onClick={() => onNavigate("response_priorities")}
                  className="flex items-center gap-2 text-xs bg-green-700/20 border border-green-700/30 text-green-400 px-4 py-2 rounded hover:bg-green-700/30 transition-colors"
                >
                  View Response Recommendation <ChevronRight size={12} />
                </button>
              </div>
            )}

            {/* Disclaimer */}
            <div className="flex items-start gap-2 bg-[#111827] border border-[#1e2d3d] rounded p-3">
              <AlertTriangle size={12} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-[#4a5568]">
                This is a simulated mission sequence. No real drone has been dispatched. All telemetry values are
                illustrative and generated for demonstration purposes only.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TelemetryCell({ icon, label, value, warn }: { icon: React.ReactNode; label: string; value: string; warn?: boolean }) {
  return (
    <div className="flex flex-col items-center py-3 gap-1">
      <span className={warn ? "text-amber-400" : "text-[#4a5568]"}>{icon}</span>
      <span className="text-[10px] text-[#4a5568] uppercase tracking-wider">{label}</span>
      <span className={`text-sm font-mono font-bold ${warn ? "text-amber-400" : "text-white"}`}>{value}</span>
    </div>
  );
}

function AerialImagePlaceholder() {
  return (
    <div className="relative w-full rounded overflow-hidden" style={{ paddingBottom: "56.25%" }}>
      <svg
        viewBox="0 0 640 360"
        className="absolute inset-0 w-full h-full"
        style={{ background: "#0a1a10" }}
      >
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef444460" />
            <stop offset="100%" stopColor="#0a1a1000" />
          </radialGradient>
        </defs>
        {/* Forest canopy pattern */}
        {[...Array(30)].map((_, i) => (
          <ellipse key={i} cx={(i * 87 + 30) % 640} cy={((i * 53) % 300) + 30} rx={20 + (i % 5) * 8} ry={15 + (i % 4) * 6} fill={`hsl(${120 + (i % 20) * 3},${30 + (i % 10)}%,${8 + (i % 8)}%)`} />
        ))}
        {/* Active fire area */}
        <ellipse cx={320} cy={200} rx={90} ry={60} fill="url(#glow)" />
        <ellipse cx={320} cy={200} rx={50} ry={35} fill="#ef444430" />
        {/* Smoke */}
        {[...Array(8)].map((_, i) => (
          <ellipse key={`s${i}`} cx={290 + i * 8} cy={160 - i * 12} rx={15 + i * 3} ry={8 + i * 2} fill={`rgba(100,100,100,${0.3 - i * 0.03})`} />
        ))}
        {/* Annotations */}
        <rect x={240} y={160} width={160} height={90} fill="none" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.8} />
        <text x={244} y={176} fill="#ef4444" fontSize={10} fontFamily="JetBrains Mono, monospace">CANDIDATE REGION</text>
        <text x={244} y={262} fill="#ef444480" fontSize={9} fontFamily="JetBrains Mono, monospace">ILLUSTRATIVE OVERLAY</text>
        {/* Drone crosshair */}
        <line x1={315} y1={195} x2={325} y2={195} stroke="#fff" strokeWidth={1} opacity={0.5} />
        <line x1={320} y1={190} x2={320} y2={200} stroke="#fff" strokeWidth={1} opacity={0.5} />
        <circle cx={320} cy={195} r={12} fill="none" stroke="#fff" strokeWidth={0.8} opacity={0.4} />
        {/* Info overlay */}
        <rect x={8} y={8} width={120} height={40} fill="rgba(13,17,23,0.7)" rx={3} />
        <text x={14} y={22} fill="#4a5568" fontSize={8} fontFamily="JetBrains Mono, monospace">ALT: 45m | SIMULATED</text>
        <text x={14} y={34} fill="#8b9bb4" fontSize={8} fontFamily="JetBrains Mono, monospace">NADIR VIEW (SAMPLE)</text>
        <text x={14} y={42} fill="#ef4444" fontSize={7} fontFamily="JetBrains Mono, monospace">HOTSPOT CANDIDATE</text>
      </svg>
    </div>
  );
}
