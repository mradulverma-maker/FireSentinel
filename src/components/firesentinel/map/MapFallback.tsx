"use client";

// SVG-based fallback map for when Leaflet tiles cannot load
interface FallbackMapProps {
  incidents: Array<{ id: string; lat: number; lng: number; status: string }>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const statusColors: Record<string, string> = {
  candidate: "#f59e0b",
  under_inspection: "#3b82f6",
  inspected_supporting: "#ef4444",
  inspected_inconclusive: "#eab308",
  low_priority: "#6b7280",
};

// Map bounds for the Blue Mountains region (approx.)
const LAT_MIN = -34.1;
const LAT_MAX = -33.65;
const LNG_MIN = 150.35;
const LNG_MAX = 150.9;

function latLngToSvg(lat: number, lng: number, w: number, h: number) {
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * w;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * h;
  return { x, y };
}

export function MapFallback({ incidents, selectedId, onSelect }: FallbackMapProps) {
  const W = 800;
  const H = 500;

  return (
    <div className="w-full h-full bg-[#0d1820] relative flex flex-col items-center justify-center">
      <div className="absolute top-2 right-2 bg-amber-900/40 border border-amber-700/30 text-amber-300 text-[10px] px-2 py-1 rounded">
        Map tiles unavailable - SVG fallback
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-full"
        style={{ background: "#0d1820" }}
      >
        {/* Terrain background */}
        <rect width={W} height={H} fill="#0d1820" />
        {/* Forest areas */}
        <ellipse cx={400} cy={250} rx={300} ry={180} fill="#0a2214" opacity={0.6} />
        <ellipse cx={200} cy={150} rx={150} ry={100} fill="#0c2716" opacity={0.5} />
        <ellipse cx={600} cy={350} rx={120} ry={80} fill="#0c2716" opacity={0.4} />
        {/* River */}
        <path d="M 50,400 Q 200,380 350,320 Q 500,260 650,300 Q 750,330 800,310" stroke="#1a3a5c" strokeWidth={8} fill="none" opacity={0.6} />
        {/* Road */}
        <path d="M 0,250 L 800,250" stroke="#1e2d3d" strokeWidth={2} fill="none" strokeDasharray="8,4" opacity={0.4} />
        <path d="M 400,0 L 400,500" stroke="#1e2d3d" strokeWidth={1.5} fill="none" strokeDasharray="8,4" opacity={0.3} />
        {/* Grid */}
        {[...Array(6)].map((_, i) => (
          <line key={`v${i}`} x1={(i * W) / 5} y1={0} x2={(i * W) / 5} y2={H} stroke="#1a2535" strokeWidth={0.5} opacity={0.3} />
        ))}
        {[...Array(5)].map((_, i) => (
          <line key={`h${i}`} x1={0} y1={(i * H) / 4} x2={W} y2={(i * H) / 4} stroke="#1a2535" strokeWidth={0.5} opacity={0.3} />
        ))}
        {/* Incident markers */}
        {incidents.map((inc) => {
          const { x, y } = latLngToSvg(inc.lat, inc.lng, W, H);
          const color = statusColors[inc.status] || "#f59e0b";
          const isSelected = inc.id === selectedId;
          return (
            <g key={inc.id} onClick={() => onSelect(inc.id)} style={{ cursor: "pointer" }}>
              {isSelected && (
                <circle cx={x} cy={y} r={20} fill={`${color}20`} stroke={color} strokeWidth={1} strokeDasharray="3 2" />
              )}
              <circle cx={x} cy={y} r={isSelected ? 9 : 6} fill={color} stroke="white" strokeWidth={isSelected ? 2 : 1} opacity={0.9} />
              <text x={x + 12} y={y + 4} fill="white" fontSize={10} fontFamily="Inter, sans-serif" fontWeight="600">{inc.id}</text>
            </g>
          );
        })}
        {/* Scale bar */}
        <rect x={20} y={H - 24} width={80} height={4} fill="#2d3f55" rx={2} />
        <text x={20} y={H - 10} fill="#4a5568" fontSize={9} fontFamily="Inter, sans-serif">~10 km</text>
        {/* Compass */}
        <text x={W - 20} y={30} fill="#4a5568" fontSize={11} fontFamily="Inter, sans-serif" textAnchor="middle">N</text>
        <line x1={W - 20} y1={35} x2={W - 20} y2={50} stroke="#4a5568" strokeWidth={1.5} />
      </svg>
    </div>
  );
}
