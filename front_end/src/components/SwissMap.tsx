import { useState } from "react";
import { motion } from "framer-motion";

interface SwissMapProps {
  onCantonClick?: (canton: string) => void;
  selectedCanton?: string;
}

// Simplified SVG paths for Swiss cantons (representative shapes)
const cantonPaths: Record<string, { d: string; cx: number; cy: number }> = {
  "Zürich": { d: "M310,120 L340,110 L360,130 L350,160 L320,155 L305,140 Z", cx: 330, cy: 135 },
  "Bern": { d: "M180,180 L230,160 L270,170 L280,210 L260,250 L220,260 L180,240 L170,210 Z", cx: 225, cy: 210 },
  "Luzern": { d: "M270,170 L300,160 L320,175 L310,200 L280,210 L270,190 Z", cx: 293, cy: 185 },
  "Basel-Stadt": { d: "M220,90 L235,85 L240,100 L225,105 Z", cx: 230, cy: 95 },
  "Basel-Landschaft": { d: "M210,100 L240,100 L245,120 L225,125 L210,115 Z", cx: 226, cy: 112 },
  "St. Gallen": { d: "M360,110 L400,100 L420,120 L410,150 L380,160 L355,145 Z", cx: 387, cy: 130 },
  "Graubünden": { d: "M380,170 L430,150 L470,180 L460,240 L420,260 L380,240 L370,200 Z", cx: 420, cy: 205 },
  "Aargau": { d: "M250,120 L280,110 L305,125 L300,150 L270,155 L250,140 Z", cx: 275, cy: 133 },
  "Thurgau": { d: "M360,90 L400,85 L410,105 L390,115 L360,110 Z", cx: 385, cy: 100 },
  "Ticino": { d: "M330,280 L360,260 L380,280 L370,320 L340,330 L320,310 Z", cx: 350, cy: 295 },
  "Vaud": { d: "M100,220 L150,210 L170,240 L160,280 L120,290 L90,260 Z", cx: 130, cy: 250 },
  "Valais": { d: "M160,270 L220,260 L280,280 L300,310 L260,340 L200,340 L150,310 Z", cx: 225, cy: 305 },
  "Genève": { d: "M70,270 L95,260 L100,285 L80,295 L65,285 Z", cx: 82, cy: 278 },
  "Fribourg": { d: "M160,200 L190,190 L200,210 L190,235 L165,235 L155,215 Z", cx: 177, cy: 215 },
  "Solothurn": { d: "M220,120 L250,115 L255,135 L235,145 L215,135 Z", cx: 235, cy: 130 },
  "Neuchâtel": { d: "M140,180 L170,175 L175,195 L155,205 L135,195 Z", cx: 155, cy: 190 },
  "Schwyz": { d: "M310,170 L335,165 L340,185 L325,195 L308,185 Z", cx: 324, cy: 180 },
  "Zug": { d: "M300,155 L315,150 L320,168 L308,172 L298,165 Z", cx: 308, cy: 162 },
  "Glarus": { d: "M350,155 L370,150 L375,170 L360,180 L345,170 Z", cx: 360, cy: 165 },
  "Schaffhausen": { d: "M310,75 L340,70 L345,90 L320,95 L305,85 Z", cx: 325, cy: 83 },
  "Appenzell Ausserrhoden": { d: "M405,105 L420,100 L425,115 L412,118 Z", cx: 415, cy: 110 },
  "Appenzell Innerrhoden": { d: "M412,118 L425,115 L428,128 L416,130 Z", cx: 420, cy: 123 },
  "Uri": { d: "M320,200 L345,190 L350,220 L335,235 L315,220 Z", cx: 333, cy: 215 },
  "Obwalden": { d: "M280,195 L305,190 L308,210 L290,215 L275,205 Z", cx: 292, cy: 203 },
  "Nidwalden": { d: "M295,180 L315,175 L318,195 L300,198 L292,190 Z", cx: 305, cy: 188 },
  "Jura": { d: "M155,130 L185,120 L195,145 L175,155 L150,145 Z", cx: 172, cy: 140 },
};

export default function SwissMap({ onCantonClick, selectedCanton }: SwissMapProps) {
  const [hoveredCanton, setHoveredCanton] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <svg viewBox="40 60 450 290" className="w-full h-auto">
        {/* Background */}
        <rect x="40" y="60" width="450" height="290" fill="none" />
        
        {Object.entries(cantonPaths).map(([name, { d, cx, cy }]) => {
          const isSelected = selectedCanton === name;
          const isHovered = hoveredCanton === name;
          return (
            <g key={name}>
              <motion.path
                d={d}
                fill={isSelected ? "hsl(var(--primary))" : isHovered ? "hsl(var(--accent))" : "hsl(var(--muted))"}
                stroke="hsl(var(--border))"
                strokeWidth={isSelected ? 2 : 1}
                className="cursor-pointer transition-colors"
                onMouseEnter={() => setHoveredCanton(name)}
                onMouseLeave={() => setHoveredCanton(null)}
                onClick={() => onCantonClick?.(name)}
                whileHover={{ scale: 1.02 }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              />
              {(isHovered || isSelected) && (
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[8px] font-semibold pointer-events-none fill-foreground"
                >
                  {name.length > 10 ? name.substring(0, 8) + "…" : name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {hoveredCanton && !selectedCanton && (
        <div className="absolute top-2 left-2 bg-card border rounded-lg px-3 py-1.5 text-sm font-medium shadow-md">
          {hoveredCanton}
        </div>
      )}
    </div>
  );
}
