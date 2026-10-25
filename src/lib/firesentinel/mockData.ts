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
