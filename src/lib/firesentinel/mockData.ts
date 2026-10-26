import type { Incident } from "./types";

// All incidents set in Indian locations (forests, national parks, reserve areas)
export const MOCK_INCIDENTS: Incident[] = [
  {
    id: "FS-2024-001",
    lat: 22.1123,
    lng: 78.6542,
    timestamp: "2024-11-14T08:23:11Z",
    source: "VIIRS Satellite Pass (Simulated)",
    status: "inspected_supporting",
    illustrativeConfidence: 87,
    inspectionStatus: "complete_supporting",
    illustrativeAreaHa: 142,
    illustrativePerimeterKm: 4.8,
    perimeterCoords: [
      { lat: 22.108, lng: 78.650 },
      { lat: 22.106, lng: 78.658 },
      { lat: 22.112, lng: 78.663 },
      { lat: 22.118, lng: 78.659 },
      { lat: 22.119, lng: 78.649 },
      { lat: 22.114, lng: 78.646 },
      { lat: 22.108, lng: 78.650 },
    ],
    droneRoute: [
      { lat: 22.095, lng: 78.638, label: "Seoni Base" },
      { lat: 22.102, lng: 78.645, label: "Waypoint A" },
      { lat: 22.112, lng: 78.654, label: "Hotspot" },
      { lat: 22.118, lng: 78.661, label: "Perimeter Survey" },
      { lat: 22.105, lng: 78.665, label: "Return" },
      { lat: 22.095, lng: 78.638, label: "Seoni Base" },
    ],
    nearbyAssets: [
      { id: "a1", name: "Seoni Forest Village", type: "settlement", distanceKm: 1.8, critical: true },
      { id: "a2", name: "NH-30 Forest Stretch", type: "road", distanceKm: 0.4, critical: false },
      { id: "a3", name: "Pench Tiger Reserve Buffer", type: "reserve", distanceKm: 3.2, critical: false },
    ],
    priorityFactors: [
      "Supporting visual evidence from simulated inspection",
      "Forest village within 2 km",
      "Active dry-wind conditions (simulated)",
      "Dense sal tree canopy noted in sample imagery",
    ],
    description: "Candidate hotspot detected near Pench Tiger Reserve in Madhya Pradesh. Simulated drone inspection returned sample imagery with supporting visual evidence. Forest village proximity elevates review priority.",
  },
  {
    id: "FS-2024-002",
    lat: 11.4890,
    lng: 76.4730,
    timestamp: "2024-11-14T09:47:33Z",
    source: "MODIS Thermal Anomaly (Simulated)",
    status: "candidate",
    illustrativeConfidence: 61,
    inspectionStatus: "not_started",
    perimeterCoords: [],
    droneRoute: [
      { lat: 11.472, lng: 76.458, label: "Ooty Outpost" },
      { lat: 11.481, lng: 76.465, label: "Waypoint A" },
      { lat: 11.489, lng: 76.473, label: "Hotspot" },
      { lat: 11.484, lng: 76.481, label: "Survey" },
      { lat: 11.472, lng: 76.458, label: "Ooty Outpost" },
    ],
    nearbyAssets: [
      { id: "a4", name: "Mudumalai Forest Track", type: "road", distanceKm: 0.7, critical: false },
      { id: "a5", name: "Pyykara River Corridor", type: "water_source", distanceKm: 2.1, critical: false },
    ],
    priorityFactors: [
      "No inspection completed yet",
      "Moderate thermal signal in dry Nilgiri shola",
      "Forest track available for ground patrol",
    ],
    description: "Candidate thermal anomaly detected in Mudumalai National Park, Tamil Nadu via MODIS pass. No drone inspection has been initiated. Forest track access may facilitate ground verification.",
  },
  {
    id: "FS-2024-003",
    lat: 20.4286,
    lng: 85.8721,
    timestamp: "2024-11-14T06:12:55Z",
    source: "VIIRS Satellite Pass (Simulated)",
    status: "inspected_inconclusive",
    illustrativeConfidence: 44,
    inspectionStatus: "complete_inconclusive",
    perimeterCoords: [
      { lat: 20.425, lng: 85.869 },
      { lat: 20.423, lng: 85.875 },
      { lat: 20.428, lng: 85.879 },
      { lat: 20.433, lng: 85.876 },
      { lat: 20.432, lng: 85.868 },
      { lat: 20.425, lng: 85.869 },
    ],
    droneRoute: [
      { lat: 20.412, lng: 85.860, label: "Phulbani Base" },
      { lat: 20.420, lng: 85.867, label: "Waypoint A" },
      { lat: 20.429, lng: 85.872, label: "Hotspot" },
      { lat: 20.412, lng: 85.860, label: "Phulbani Base" },
    ],
    nearbyAssets: [
      { id: "a6", name: "Baliguda Forest Road", type: "road", distanceKm: 1.2, critical: false },
      { id: "a7", name: "33kV Odisha Grid Line", type: "powerline", distanceKm: 0.9, critical: true },
    ],
    priorityFactors: [
      "Inconclusive inspection - smoke haze in simulated imagery",
      "High-voltage grid line within 1 km",
      "Further observation recommended",
    ],
    description: "Inspection imagery partially obscured by haze in Kandhamal district forest, Odisha. The thermal signal is ambiguous. Powerline proximity warrants continued monitoring.",
  },
  {
    id: "FS-2024-004",
    lat: 29.5285,
    lng: 79.3142,
    timestamp: "2024-11-14T11:05:20Z",
    source: "Himawari-9 Pass (Simulated)",
    status: "under_inspection",
    illustrativeConfidence: 73,
    inspectionStatus: "in_progress",
    perimeterCoords: [],
    droneRoute: [
      { lat: 29.512, lng: 79.300, label: "Ramnagar Base" },
      { lat: 29.520, lng: 79.308, label: "Waypoint A" },
      { lat: 29.529, lng: 79.314, label: "Hotspot" },
      { lat: 29.536, lng: 79.322, label: "Survey" },
      { lat: 29.512, lng: 79.300, label: "Ramnagar Base" },
    ],
    nearbyAssets: [
      { id: "a8", name: "Ramnagar Township", type: "settlement", distanceKm: 2.8, critical: true },
      { id: "a9", name: "Corbett-Ramnagar Highway", type: "road", distanceKm: 1.5, critical: false },
      { id: "a10", name: "Ramganga River Corridor", type: "water_source", distanceKm: 0.5, critical: false },
    ],
    priorityFactors: [
      "Simulated drone inspection in progress",
      "Township within 3 km",
      "Major highway within 1.5 km (evacuation route)",
    ],
    description: "A simulated drone is currently en route to this candidate hotspot near Jim Corbett National Park, Uttarakhand. Assessment will be available once the inspection sequence completes.",
  },
  {
    id: "FS-2024-005",
    lat: 15.3467,
    lng: 74.8134,
    timestamp: "2024-11-13T22:44:07Z",
    source: "MODIS Thermal Anomaly (Simulated)",
    status: "low_priority",
    illustrativeConfidence: 28,
    inspectionStatus: "complete_inconclusive",
    illustrativeAreaHa: 12,
    illustrativePerimeterKm: 1.4,
    perimeterCoords: [
      { lat: 15.343, lng: 74.810 },
      { lat: 15.342, lng: 74.817 },
      { lat: 15.347, lng: 74.819 },
      { lat: 15.350, lng: 74.815 },
      { lat: 15.348, lng: 74.809 },
      { lat: 15.343, lng: 74.810 },
    ],
    droneRoute: [
      { lat: 15.333, lng: 74.805, label: "Hubli Outpost" },
      { lat: 15.340, lng: 74.811, label: "Waypoint A" },
      { lat: 15.347, lng: 74.813, label: "Hotspot" },
      { lat: 15.333, lng: 74.805, label: "Hubli Outpost" },
    ],
    nearbyAssets: [
      { id: "a11", name: "Dharwad-Hubli State Road", type: "road", distanceKm: 3.4, critical: false },
    ],
    priorityFactors: [
      "Low thermal signal strength",
      "No critical assets nearby",
      "Inconclusive inspection consistent with agricultural burning",
    ],
    description: "Low-confidence thermal anomaly in Dharwad forest fringe, Karnataka. Simulated inspection suggests possible controlled agricultural burn-off. No immediate threat identified.",
  },
];

// Jim Corbett as drone base center
export const DRONE_BASE = { lat: 29.512, lng: 79.300 };

export function getIncidentById(id: string): Incident | undefined {
  return MOCK_INCIDENTS.find((inc) => inc.id === id);
}

export const SUMMARY_METRICS = {
  totalCandidates: MOCK_INCIDENTS.length,
  inspectionsCompleted: MOCK_INCIDENTS.filter(
    (i) => i.inspectionStatus === "complete_supporting" || i.inspectionStatus === "complete_inconclusive"
  ).length,
  requireReview: MOCK_INCIDENTS.filter(
    (i) => i.status === "inspected_supporting" || i.status === "under_inspection"
  ).length,
  missionsInProgress: MOCK_INCIDENTS.filter((i) => i.inspectionStatus === "in_progress").length,
};

// --- SENSOR NETWORK (SIMULATED) ---
export const MOCK_SENSORS: import("./types").Sensor[] = [
  { id: "SEN-001", name: "Pench North Node", lat: 22.1200, lng: 78.6480, status: "warning", tempC: 48.2, humidityPct: 18, smokeIndexPpm: 320, lastUpdated: "2024-11-14T08:15:00Z", incidentId: "FS-2024-001" },
  { id: "SEN-002", name: "Pench South Node", lat: 22.1050, lng: 78.6600, status: "online", tempC: 36.4, humidityPct: 34, smokeIndexPpm: 45, lastUpdated: "2024-11-14T08:18:00Z" },
  { id: "SEN-003", name: "Mudumalai Edge Node", lat: 11.4920, lng: 76.4760, status: "online", tempC: 31.8, humidityPct: 52, smokeIndexPpm: 22, lastUpdated: "2024-11-14T09:40:00Z", incidentId: "FS-2024-002" },
  { id: "SEN-004", name: "Kandhamal Ridge Node", lat: 20.4310, lng: 85.8750, status: "offline", tempC: 0, humidityPct: 0, smokeIndexPpm: 0, lastUpdated: "2024-11-14T04:00:00Z", incidentId: "FS-2024-003" },
  { id: "SEN-005", name: "Corbett Valley Node", lat: 29.5320, lng: 79.3180, status: "online", tempC: 29.1, humidityPct: 44, smokeIndexPpm: 61, lastUpdated: "2024-11-14T11:00:00Z", incidentId: "FS-2024-004" },
  { id: "SEN-006", name: "Dharwad Fringe Node", lat: 15.3490, lng: 74.8160, status: "online", tempC: 27.3, humidityPct: 61, smokeIndexPpm: 14, lastUpdated: "2024-11-13T22:30:00Z", incidentId: "FS-2024-005" },
];

export const MOCK_WEATHER: import("./types").WeatherSnapshot = {
  windDirection: "NE", windSpeedKmh: 22, tempC: 34, humidityPct: 21, dryLightningRisk: false,
};

export const MOCK_COMMUNITIES: import("./types").CommunityAtRisk[] = [
  { id: "COM-001", name: "Seoni Forest Village", population: 420, distanceKm: 1.8, inZone: true, nearZone: true },
  { id: "COM-002", name: "Pench Kisan Colony", population: 210, distanceKm: 3.1, inZone: false, nearZone: true },
  { id: "COM-003", name: "NH-30 Dhaba Cluster", population: 65, distanceKm: 0.4, inZone: true, nearZone: true },
  { id: "COM-004", name: "Turiya Forest Hamlet", population: 140, distanceKm: 4.8, inZone: false, nearZone: false },
  { id: "COM-005", name: "Pench Tourism Zone", population: 80, distanceKm: 2.6, inZone: false, nearZone: true },
];

export const MOCK_TIMELINE: import("./types").TimelineEvent[] = [
  { id: "TL-001", time: "08:23", type: "detection", incidentId: "FS-2024-001", label: "VIIRS hotspot detected", detail: "Satellite pass identified candidate thermal anomaly at Pench, MP", simulated: true },
  { id: "TL-002", time: "08:25", type: "sensor", incidentId: "FS-2024-001", label: "SEN-001 smoke spike", detail: "Smoke index rose to 320 ppm at Pench North Node", simulated: true },
  { id: "TL-003", time: "08:41", type: "drone", incidentId: "FS-2024-001", label: "Drone dispatched", detail: "Mission FS-2024-001 initiated from Seoni Base", simulated: true },
  { id: "TL-004", time: "09:12", type: "assessment", incidentId: "FS-2024-001", label: "Inspection complete", detail: "Supporting visual evidence. Fire perimeter estimated ~142 ha", simulated: true },
  { id: "TL-005", time: "09:18", type: "spread", incidentId: "FS-2024-001", label: "Risk zone projected", detail: "Illustrative NE spread projected. Seoni Village in estimated zone", simulated: true },
  { id: "TL-006", time: "09:25", type: "warning", incidentId: "FS-2024-001", label: "Draft warning created", detail: "Community Early-Warning draft submitted for authority review", simulated: true },
  { id: "TL-007", time: "09:47", type: "detection", incidentId: "FS-2024-002", label: "MODIS anomaly, Mudumalai TN", detail: "Thermal anomaly detected in Nilgiri shola belt", simulated: true },
  { id: "TL-008", time: "10:05", type: "assessment", incidentId: "FS-2024-003", label: "Inconclusive, Kandhamal OD", detail: "Smoke haze obscured imagery. SEN-004 offline", simulated: true },
  { id: "TL-009", time: "11:05", type: "drone", incidentId: "FS-2024-004", label: "Drone en route, Jim Corbett", detail: "Inspection underway for Himawari-9 anomaly near Ramnagar", simulated: true },
  { id: "TL-010", time: "22:44", type: "detection", incidentId: "FS-2024-005", label: "Low-priority signal, Dharwad", detail: "Low-confidence anomaly consistent with agricultural burn-off", simulated: true },
];

export const INITIAL_WARNING_DRAFT: import("./types").WarningDraft = {
  id: "WARN-001",
  incidentId: "FS-2024-001",
  title: "Forest Fire Advisory: Pench Tiger Reserve Buffer, MP",
  affectedArea: "Seoni Forest Village and surrounds within ~5 km radius of FS-2024-001 hotspot",
  reason: "Satellite-detected thermal anomaly with supporting visual evidence from simulated drone inspection. Illustrative fire spread model indicates NE movement toward Seoni Forest Village.",
  recommendedAction: "Advisory: Residents of Seoni Forest Village and NH-30 Dhaba Cluster should prepare for possible evacuation. Forestry officers to verify on-ground conditions. This is a SIMULATED demonstration.",
  status: "draft",
  createdAt: "2024-11-14T09:25:00Z",
  reviewChecklist: [
    { item: "Satellite data reviewed by operator", checked: true },
    { item: "Drone inspection evidence reviewed", checked: true },
    { item: "Affected communities identified on map", checked: true },
    { item: "Warning text reviewed for accuracy", checked: false },
    { item: "Authority sign-off obtained (simulation)", checked: false },
    { item: "Dissemination channels confirmed", checked: false },
  ],
};
