"use client";
import { useEffect, useRef, useState } from "react";
import type { Incident, Sensor } from "../../../lib/firesentinel/types";
import { MOCK_SENSORS, MOCK_WEATHER } from "../../../lib/firesentinel/mockData";

interface LeafletMapProps {
  incidents: Incident[];
  selectedIncidentId: string | null;
  onSelectIncident: (id: string) => void;
  showHotspots: boolean;
  showSensors: boolean;
  showDroneRoute: boolean;
  showPerimeter: boolean;
  showRiskZone: boolean;
  showSettlements: boolean;
  showRoads: boolean;
  showWind: boolean;
  missionProgress?: number;
}

export default function LeafletMap({
  incidents,
  selectedIncidentId,
  onSelectIncident,
  showHotspots,
  showSensors,
  showDroneRoute,
  showPerimeter,
  showRiskZone,
  showSettlements,
  showRoads,
  showWind,
  missionProgress = 0,
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<import("leaflet").Map | null>(null);
  const layersRef = useRef<import("leaflet").Layer[]>([]);
  const [mapError, setMapError] = useState(false);
  const initCalled = useRef(false);

  useEffect(() => {
    if (initCalled.current) return;
    initCalled.current = true;

    const initMap = async () => {
      try {
        if (!mapRef.current) return;
        const L = (await import("leaflet")).default;

        delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        const container = mapRef.current as HTMLElement & { _leaflet_id?: number };
        if (container._leaflet_id) delete container._leaflet_id;
        if (mapInstanceRef.current) {
          try { mapInstanceRef.current.remove(); } catch (_) {}
          mapInstanceRef.current = null;
        }

        const map = L.map(mapRef.current, {
          center: [22.5, 80.5],
          zoom: 5,
          zoomControl: true,
          attributionControl: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;
        renderLayers(map, L);
      } catch (err) {
        console.error("Map init failed:", err);
        setMapError(true);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        try { mapInstanceRef.current.remove(); } catch (_) {}
        mapInstanceRef.current = null;
      }
      initCalled.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderLayers = (map: import("leaflet").Map, L: typeof import("leaflet")) => {
    layersRef.current.forEach((l) => { try { map.removeLayer(l); } catch (_) {} });
    layersRef.current = [];

    const statusColors: Record<string, string> = {
      candidate: "#f59e0b",
      under_inspection: "#3b82f6",
      confirmed_hotspot: "#ef4444",
      inspected_supporting: "#ef4444",
      inspected_inconclusive: "#eab308",
      low_priority: "#6b7280",
    };

    // 1. Hotspots
    if (showHotspots) {
      incidents.forEach((inc) => {
        const color = statusColors[inc.status] || "#f59e0b";
        const isSelected = inc.id === selectedIncidentId;

        const icon = L.divIcon({
          className: "",
          html: `<div style="width:${isSelected ? 22 : 14}px;height:${isSelected ? 22 : 14}px;background:${color};border:2px solid ${isSelected ? "#fff" : "rgba(255,255,255,0.3)"};border-radius:50%;box-shadow:0 0 ${isSelected ? 18 : 6}px ${color}aa;cursor:pointer;"></div>`,
          iconSize: [isSelected ? 22 : 14, isSelected ? 22 : 14],
          iconAnchor: [isSelected ? 11 : 7, isSelected ? 11 : 7],
        });

        const marker = L.marker([inc.lat, inc.lng], { icon })
          .addTo(map)
          .bindPopup(`<div style="font-family:Inter,sans-serif;min-width:180px;"><b style="font-size:13px">${inc.id}</b><div style="color:#888;font-size:11px;margin:3px 0">${inc.source}</div><div style="color:${color};font-size:11px;font-weight:600">${inc.status.replace(/_/g," ").toUpperCase()}</div><div style="color:#aaa;font-size:10px;margin-top:4px">${inc.description.slice(0,100)}...</div><div style="color:#888;font-size:10px;margin-top:3px">Conf.(Illus.): ${inc.illustrativeConfidence}%</div></div>`, { maxWidth: 260 })
          .on("click", () => onSelectIncident(inc.id));
        layersRef.current.push(marker);
      });
    }

    // 2. Sensors Layer
    if (showSensors) {
      MOCK_SENSORS.forEach((s) => {
        const sensorColor = s.status === "online" ? "#22c55e" : s.status === "warning" ? "#f59e0b" : "#6b7280";
        const icon = L.divIcon({
          className: "",
          html: `<div style="width:16px;height:16px;background:#0d1520;border:2px solid ${sensorColor};border-radius:4px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 8px ${sensorColor}88;cursor:pointer;"><span style="width:6px;height:6px;border-radius:50%;background:${sensorColor};display:block;"></span></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });

        const marker = L.marker([s.lat, s.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:Inter,sans-serif;min-width:180px;background:#0b1118;color:#e4edf8;padding:4px;">
              <div style="font-weight:700;font-size:12px;color:#fff;">📡 ${s.id} · ${s.name}</div>
              <div style="color:${sensorColor};font-size:10px;font-weight:bold;margin:2px 0 6px;">STATUS: ${s.status.toUpperCase()} (SIMULATED)</div>
              ${s.status !== "offline" ? `
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;background:rgba(255,255,255,0.03);padding:6px;border-radius:6px;text-align:center;">
                  <div><div style="font-size:12px;font-weight:bold;color:${s.tempC > 45 ? "#ef4444" : "#f97316"}">${s.tempC}°</div><div style="font-size:8px;color:#888;">Temp</div></div>
                  <div><div style="font-size:12px;font-weight:bold;color:#3b82f6">${s.humidityPct}%</div><div style="font-size:8px;color:#888;">Humid</div></div>
                  <div><div style="font-size:12px;font-weight:bold;color:${s.smokeIndexPpm > 200 ? "#ef4444" : "#8b5cf6"}">${s.smokeIndexPpm}</div><div style="font-size:8px;color:#888;">Smoke</div></div>
                </div>
              ` : `<div style="font-size:10px;color:#888;font-style:italic;">Sensor offline</div>`}
            </div>
          `, { maxWidth: 220 });
        layersRef.current.push(marker);
      });
    }

    // 3. Est. Perimeter Polygon
    if (showPerimeter) {
      incidents.forEach((inc) => {
        if (inc.perimeterCoords.length > 2) {
          const poly = L.polygon(
            inc.perimeterCoords.map((c) => [c.lat, c.lng] as [number, number]),
            { color: "#ef4444", weight: 2, fillColor: "#ef4444", fillOpacity: 0.15, dashArray: "5 5" }
          ).addTo(map);
          layersRef.current.push(poly);
        }
      });
    }

    // 4. Projected Risk Zone
    if (showRiskZone) {
      incidents.forEach((inc) => {
        if (inc.id === "FS-2024-001" || inc.id === selectedIncidentId) {
          // Illustrative spread zone projected NE
          const centerLat = inc.lat + 0.006;
          const centerLng = inc.lng + 0.007;
          const riskCircle = L.circle([centerLat, centerLng], {
            radius: 2800, // meters
            color: "#f97316",
            weight: 1.5,
            dashArray: "4 4",
            fillColor: "#f97316",
            fillOpacity: 0.12,
          }).addTo(map);
          riskCircle.bindPopup(`<div style="font-size:11px;font-family:Inter,sans-serif;"><b>Projected Risk Zone (Illustrative)</b><br/>~2.8 km buffer based on NE wind vector.<br/><i style="color:#888;">Visual simulation only — not an evacuation zone.</i></div>`);
          layersRef.current.push(riskCircle);
        }
      });
    }

    // 5. Settlements and Roads
    incidents.forEach((inc) => {
      const isSelected = inc.id === selectedIncidentId;
      if (isSelected) {
        inc.nearbyAssets.forEach((asset) => {
          if (asset.type === "settlement" && !showSettlements) return;
          if (asset.type === "road" && !showRoads) return;

          const aColor = asset.type === "settlement" ? "#3b82f6" : "#eab308";
          const aIcon = L.divIcon({
            className: "",
            html: `<div style="background:${asset.critical ? "#1e3a5f" : "#1a2234"};border:1px solid ${asset.critical ? "#3b82f6" : "#2d3f55"};color:${asset.critical ? "#93c5fd" : "#8b9bb4"};font-size:9px;padding:2px 6px;border-radius:4px;white-space:nowrap;font-family:Inter,sans-serif;">${asset.name}</div>`,
            iconAnchor: [0, 0]
          });
          const angle = Math.random() * Math.PI * 2;
          const dist = asset.distanceKm / 111;
          layersRef.current.push(L.marker([inc.lat + Math.sin(angle) * dist, inc.lng + Math.cos(angle) * dist], { icon: aIcon }).addTo(map));
        });
      }
    });

    // 6. Drone Route
    if (showDroneRoute) {
      incidents.forEach((inc) => {
        const isSelected = inc.id === selectedIncidentId;
        if (isSelected && inc.droneRoute.length > 1) {
          const pts = inc.droneRoute.map((w) => [w.lat, w.lng] as [number, number]);
          layersRef.current.push(L.polyline(pts, { color: "#60a5fa", weight: 2, dashArray: "6 4" }).addTo(map));
          if (missionProgress > 0 && missionProgress < 100) {
            const idx = Math.min(Math.floor((missionProgress / 100) * (pts.length - 1)), pts.length - 1);
            const droneIcon = L.divIcon({ className: "", html: `<div style="font-size:22px;line-height:1;">🛸</div>`, iconSize: [26, 26], iconAnchor: [13, 13] });
            layersRef.current.push(L.marker(pts[idx], { icon: droneIcon }).addTo(map));
          }
        }
      });
    }

    // 7. Wind Direction Indicator
    if (showWind) {
      const activeInc = incidents.find((i) => i.id === selectedIncidentId) || incidents[0];
      if (activeInc) {
        const windIcon = L.divIcon({
          className: "",
          html: `<div style="background:rgba(6,10,16,0.85);border:1px solid #3b82f6;border-radius:8px;padding:4px 8px;display:flex;align-items:center;gap:6px;box-shadow:0 0 12px rgba(59,130,246,0.3);color:#3b82f6;font-family:Inter,sans-serif;font-size:10px;font-weight:bold;white-space:nowrap;">
            <span style="font-size:14px;">↗</span> Wind: ${MOCK_WEATHER.windDirection} ${MOCK_WEATHER.windSpeedKmh} km/h (Sim.)
          </div>`,
          iconAnchor: [0, 0]
        });
        const windMarker = L.marker([activeInc.lat + 0.015, activeInc.lng + 0.012], { icon: windIcon }).addTo(map);
        layersRef.current.push(windMarker);
      }
    }

    // Camera view adjustment
    if (incidents.length > 0 && !selectedIncidentId) {
      map.fitBounds(L.latLngBounds(incidents.map((i) => [i.lat, i.lng] as [number, number])), { padding: [60, 60] });
    } else if (selectedIncidentId) {
      const sel = incidents.find((i) => i.id === selectedIncidentId);
      if (sel) map.setView([sel.lat, sel.lng], 11, { animate: true });
    }
  };

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import("leaflet").then((mod) => {
      if (mapInstanceRef.current) renderLayers(mapInstanceRef.current, mod.default);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    incidents, selectedIncidentId, showHotspots, showSensors, showDroneRoute,
    showPerimeter, showRiskZone, showSettlements, showRoads, showWind, missionProgress
  ]);

  if (mapError) return null;

  return <div ref={mapRef} style={{ position: "absolute", inset: 0 }} />;
}
