import React, { useMemo, useState } from "react";


type LocationMetric = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  starScore: number; // 0-100
  cloudCover: number; // 0-100
  lightPollution: number; // 0-100
  lastUpdated: string;
};

const INITIAL_LOCATIONS: LocationMetric[] = [
  {
    id: "raipur",
    name: "Raipur Observatory",
    lat: 21.2514,
    lng: 81.6296,
    starScore: 62,
    cloudCover: 20,
    lightPollution: 70,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "bilaspur",
    name: "Bilaspur Field",
    lat: 22.0793,
    lng: 82.1391,
    starScore: 75,
    cloudCover: 10,
    lightPollution: 45,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "jashpur",
    name: "Jashpur Hills",
    lat: 22.6579,
    lng: 84.0289,
    starScore: 88,
    cloudCover: 5,
    lightPollution: 12,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "bastar",
    name: "Bastar Clearing",
    lat: 19.079,
    lng: 82.1391,
    starScore: 80,
    cloudCover: 12,
    lightPollution: 20,
    lastUpdated: new Date().toISOString(),
  },
];

export default function Mytab() {
  const [locations, setLocations] =
    useState<LocationMetric[]>(INITIAL_LOCATIONS);
  const recommendations = useMemo(() => {
    return [...locations]
      .map((l) => ({
        ...l,
        score: Math.round(
          l.starScore * 0.6 +
            (100 - l.cloudCover) * 0.25 +
            (100 - l.lightPollution) * 0.15
        ),
      }))
      .sort((a, b) => b.score - a.score);
  }, [locations]);

  return (
    <div>
      <aside className="space-y-4">
        <div className="p-3 rounded-2xl shadow-md bg-gradient-to-b from-slate-800/60 to-slate-900/40">
          <h3 className="text-lg text-white font-semibold mb-2">
            Daily Recommendations
          </h3>
          <ol className="space-y-2">
            {recommendations.slice(0, 4).map((r) => (
              <li
                key={r.id}
                className="flex text-white items-center justify-between gap-2 border-b pb-2"
              >
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-white opacity-80">
                    Score: {Math.floor(Math.random() * 100) + 1}
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-3"></div>
        </div>
      </aside>
    </div>
  );
}
