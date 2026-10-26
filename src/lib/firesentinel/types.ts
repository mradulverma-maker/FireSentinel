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


// --- NEW MODULE TYPES ---

export type SensorStatus = "online" | "offline" | "warning";

export interface Sensor {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: SensorStatus;
  tempC: number;
  humidityPct: number;
  smokeIndexPpm: number;
  lastUpdated: string;
  incidentId?: string;
}

export type WindDirection = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

export interface WeatherSnapshot {
  windDirection: WindDirection;
  windSpeedKmh: number;
  tempC: number;
  humidityPct: number;
  dryLightningRisk: boolean;
}

export type TimeStep = "current" | "+15min" | "+30min" | "+60min";

export interface CommunityAtRisk {
  id: string;
  name: string;
  population: number;
  distanceKm: number;
  inZone: boolean;
  nearZone: boolean;
}

export type WarningStatus = "draft" | "awaiting_review" | "approved_simulation" | "closed";

export interface WarningDraft {
  id: string;
  incidentId: string;
  title: string;
  affectedArea: string;
  reason: string;
  recommendedAction: string;
  status: WarningStatus;
  createdAt: string;
  reviewChecklist: { item: string; checked: boolean }[];
}

export type TimelineEventType = "detection" | "sensor" | "drone" | "assessment" | "warning" | "spread" | "alert";

export interface TimelineEvent {
  id: string;
  time: string;
  type: TimelineEventType;
  incidentId: string;
  label: string;
  detail: string;
  simulated: true;
}

export type NavPage =
  | "overview"
  | "incident_map"
  | "cv_lab"
  | "drone_simulator"
  | "response_priorities"
  | "sensor_network"
  | "fire_spread"
  | "early_warning"
  | "about";
