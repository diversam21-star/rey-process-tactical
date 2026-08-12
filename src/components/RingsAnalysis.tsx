import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';

const ringData = [
  { subject: 'Ring 1', A: 120, fullMark: 150 },
  { subject: 'Ring 2', A: 98, fullMark: 150 },
  { subject: 'Ring 3', A: 86, fullMark: 150 },
  { subject: 'Ring 4', A: 99, fullMark: 150 },
  { subject: 'Ring 5', A: 85, fullMark: 150 },
  { subject: 'Ring 6', A: 65, fullMark: 150 },
];

export const RingsAnalysis: React.FC = () => (
  <div className="w-full h-48 bg-white border-2 border-black p-2 shadow-[4px_4px_0px_0px_black]">
    <div className="flex justify-between items-center mb-1 px-2">
      <span className="text-[10px] uppercase font-black text-black">
        SPATIAL DENSITY
      </span>
      <span className="text-[10px] font-bold text-tactical-accent">
        SCANNING
      </span>
    </div>
    <RadarChart width="100%" height="100%" data={ringData} cx="50%" cy="50%" outerRadius="80%">
      <PolarGrid stroke="#000" strokeWidth={1} />
      <PolarAngleAxis dataKey="subject" tick={{ fill: '#000', fontSize: 10, fontWeight: 'bold' }} />
      <PolarRadiusAxis />
      <Radar
        name="Density"
        dataKey="A"
        stroke="#ff4e00"
        strokeWidth={3}
        fill="#ff4e00"
        fillOpacity={0.6}
      />
    </RadarChart>
  </div>
);
