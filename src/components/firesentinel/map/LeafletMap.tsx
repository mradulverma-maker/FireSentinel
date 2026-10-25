"use client";
import { useEffect, useRef, useState } from "react";
import type { Incident } from "../../../lib/firesentinel/types";

interface LeafletMapProps {
  incidents: Incident[];
  selectedIncidentId: string | null;
  onSelectIncident: (id: string) => void;
  showHotspots: boolean;
  showDroneRoute: boolean;
  showPerimeter: boolean;
  showAssets: boolean;
  missionProgress?: number;
}

export default function LeafletMap({
  incidents,
  selectedIncidentId,
  onSelectIncident,
  showHotspots,
  showDroneRoute,
  showPerimeter,
  showAssets,
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

    incidents.forEach((inc) => {
      if (!showHotspots) return;
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

      if (showPerimeter && inc.perimeterCoords.length > 2) {
        const poly = L.polygon(inc.perimeterCoords.map((c) => [c.lat, c.lng] as [number, number]), { color: "#ef4444", weight: 2, fillColor: "#ef4444", fillOpacity: 0.15, dashArray: "5 5" }).addTo(map);
        layersRef.current.push(poly);
      }

      if (showDroneRoute && isSelected && inc.droneRoute.length > 1) {
        const pts = inc.droneRoute.map((w) => [w.lat, w.lng] as [number, number]);
        layersRef.current.push(L.polyline(pts, { color: "#60a5fa", weight: 2, dashArray: "6 4" }).addTo(map));
        if (missionProgress > 0 && missionProgress < 100) {
          const idx = Math.min(Math.floor((missionProgress / 100) * (pts.length - 1)), pts.length - 1);
          const droneIcon = L.divIcon({ className: "", html: `<div style="font-size:22px;line-height:1;">🛸</div>`, iconSize: [26, 26], iconAnchor: [13, 13] });
          layersRef.current.push(L.marker(pts[idx], { icon: droneIcon }).addTo(map));
        }
      }

      if (showAssets && isSelected) {
        inc.nearbyAssets.forEach((asset) => {
          const aIcon = L.divIcon({ className: "", html: `<div style="background:${asset.critical ? "#1e3a5f" : "#1a2234"};border:1px solid ${asset.critical ? "#3b82f6" : "#2d3f55"};color:${asset.critical ? "#93c5fd" : "#8b9bb4"};font-size:9px;padding:2px 6px;border-radius:4px;white-space:nowrap;font-family:Inter,sans-serif;">${asset.name}</div>`, iconAnchor: [0, 0] });
          const angle = Math.random() * Math.PI * 2;
          const dist = asset.distanceKm / 111;
          layersRef.current.push(L.marker([inc.lat + Math.sin(angle) * dist, inc.lng + Math.cos(angle) * dist], { icon: aIcon }).addTo(map));
        });
      }
    });

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
  }, [incidents, selectedIncidentId, showHotspots, showDroneRoute, showPerimeter, showAssets, missionProgress]);

  if (mapError) return null;

  return <div ref={mapRef} style={{ position: "absolute", inset: 0 }} />;
}
