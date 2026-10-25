// FireSentinel — TypeScript Interfaces
// All data is mock/simulated for demonstration purposes only

export type IncidentStatus =
  | "candidate"
  | "under_inspection"
  | "confirmed_hotspot"
  | "inspected_supporting"
  | "inspected_inconclusive"
  | "low_priority";

export type InspectionStatus =
  | "not_started"
  | "pending"
  | "in_progress"
  | "complete_supporting"
  | "complete_inconclusive"
  | "failed";

export type AssetType =
  | "settlement"
  | "road"
  | "water_source"
  | "powerline"
  | "reserve";

export interface NearbyAsset {
  id: string;
  name: string;
  type: AssetType;
  distanceKm: number;
  critical: boolean;
}

export interface PerimeterCoord {
  lat: number;
  lng: number;
}

export interface DroneWaypoint {
  lat: number;
  lng: number;
  label: string;
}

export interface Incident {
  id: string;
  lat: number;
  lng: number;
  timestamp: string;
  source: string;
  status: IncidentStatus;
  illustrativeConfidence: number;
  inspectionStatus: InspectionStatus;
  sampleImageUrl?: string;
  illustrativeAreaHa?: number;
  illustrativePerimeterKm?: number;
  perimeterCoords: PerimeterCoord[];
  droneRoute: DroneWaypoint[];
  nearbyAssets: NearbyAsset[];
  priorityFactors: string[];
  description: string;
}

export type MissionPhase =
  | "idle"
  | "planned"
  | "en_route"
  | "inspecting"
  | "complete"
  | "assessment_available";

export interface MissionState {
  phase: MissionPhase;
  incidentId: string | null;
  startedAt: string | null;
  elapsedSeconds: number;
  simulatedAltitudeM: number;
  simulatedBatteryPct: number;
  progressPct: number;
}

export type PriorityCategory =
  | "immediate_review"
  | "prompt_review"
  | "further_assessment"
  | "monitor"
  | "low_priority";

export interface RecommendationResult {
  category: PriorityCategory;
  headline: string;
  rationale: string[];
  uncertainties: string[];
  suggestedNextStep: string;
  relevantAssets: NearbyAsset[];
}

export type NavPage =
  | "overview"
  | "incident_map"
  | "cv_lab"
  | "drone_simulator"
  | "response_priorities"
  | "about";
