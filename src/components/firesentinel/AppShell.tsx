"use client";
import { useState, useCallback } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { OverviewPage } from "./pages/OverviewPage";
import { IncidentMapPage } from "./pages/IncidentMapPage";
import { CVLabPage } from "./pages/CVLabPage";
import { DroneSimulatorPage } from "./pages/DroneSimulatorPage";
import { ResponsePrioritiesPage } from "./pages/ResponsePrioritiesPage";
import { AboutPage } from "./pages/AboutPage";
import { SensorNetworkPage } from "./pages/SensorNetworkPage";
import { FireSpreadPage } from "./pages/FireSpreadPage";
import { EarlyWarningPage } from "./pages/EarlyWarningPage";
import type { NavPage, MissionPhase } from "../../lib/firesentinel/types";

export function AppShell() {
  const [activePage, setActivePage] = useState<NavPage>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>("FS-2024-001");
  const [missionPhase, setMissionPhase] = useState<MissionPhase>("idle");
  const [missionProgress, setMissionProgress] = useState(0);

  const handleNavigate = useCallback((page: NavPage) => {
    setActivePage(page);
    setSearchQuery("");
  }, []);

  const handleSelectIncident = useCallback((id: string) => {
    setSelectedIncidentId(id);
  }, []);

  const handleLaunchMission = useCallback((id: string) => {
    setSelectedIncidentId(id);
    setActivePage("drone_simulator");
    setMissionPhase("planned");
  }, []);

  const handleMissionPhaseChange = useCallback((phase: MissionPhase) => {
    setMissionPhase(phase);
    // Update progress for map animation
    const phaseProgress: Record<MissionPhase, number> = {
      idle: 0,
      planned: 10,
      en_route: 35,
      inspecting: 70,
      complete: 90,
      assessment_available: 100,
    };
    setMissionProgress(phaseProgress[phase] ?? 0);
  }, []);

  return (
    <div className="flex h-screen bg-[#0d1117] overflow-hidden">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          activePage={activePage}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <main className="flex-1 overflow-hidden">
          {activePage === "overview" && (
            <OverviewPage
              onNavigate={handleNavigate}
              onSelectIncident={handleSelectIncident}
              searchQuery={searchQuery}
            />
          )}
          {activePage === "incident_map" && (
            <IncidentMapPage
              selectedIncidentId={selectedIncidentId}
              onSelectIncident={handleSelectIncident}
              onNavigate={handleNavigate}
              onLaunchMission={handleLaunchMission}
              searchQuery={searchQuery}
              missionProgress={missionProgress}
            />
          )}
          {activePage === "cv_lab" && <CVLabPage />}
          {activePage === "drone_simulator" && (
            <DroneSimulatorPage
              selectedIncidentId={selectedIncidentId}
              onSelectIncident={handleSelectIncident}
              onNavigate={handleNavigate}
              externalMissionPhase={missionPhase}
              onMissionPhaseChange={handleMissionPhaseChange}
            />
          )}
          {activePage === "response_priorities" && (
            <ResponsePrioritiesPage
              selectedIncidentId={selectedIncidentId}
              onSelectIncident={handleSelectIncident}
              onNavigate={handleNavigate}
              searchQuery={searchQuery}
            />
          )}
          {activePage === "sensor_network" && <SensorNetworkPage />}
          {activePage === "fire_spread" && <FireSpreadPage />}
          {activePage === "early_warning" && <EarlyWarningPage />}
          {activePage === "about" && <AboutPage />}
        </main>
      </div>
    </div>
  );
}

