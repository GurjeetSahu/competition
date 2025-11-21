"use client";
import GoogleMap from "@/components/custom/map";
import React, { JSX, useEffect, useMemo, useState } from "react";

/*
  Night-Sky Monitoring Dashboard (single-file React component)
  - Tailwind CSS utility classes used for styling
  - Uses shadcn-style component imports as placeholders (adjust to your project)
  - Uses recharts for charts
  - Map is a lightweight clickable SVG/absolute marker layout (no external map provider required)
  - Simulates "real-time" updates with setInterval
  - Reads the problem statement PDF path (uploaded alongside the project)

  NOTE: Replace/adjust the shadcn imports to match your codebase or use simple HTML elements.
*/

// Path to uploaded problem statement PDF (kept for reference / deployment)

// Example shadcn-style imports (if your project uses shadcn UI, otherwise replace with simple elements)
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardContent } from "@/components/ui/card";
// import { Switch } from "@/components/ui/switch";
// import { Input } from "@/components/ui/input";
// import { Search } from "lucide-react";

// Recharts for charts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// Type for location metrics
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

// Initial mock locations in Chhattisgarh (latitude/longitude are illustrative)
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

// Helper: rating text
function ratingFromScore(score: number) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Great";
  if (score >= 50) return "Good";
  if (score >= 30) return "Fair";
  return "Poor";
}

// Generates small random variation for simulation
function jitter(value: number, maxJitter = 6) {
  const delta = (Math.random() * 2 - 1) * maxJitter;
  const v = Math.max(0, Math.min(100, Math.round(value + delta)));
  return v;
}

export default function NightSkyDashboard(): JSX.Element {
  const [locations, setLocations] =
    useState<LocationMetric[]>(INITIAL_LOCATIONS);
  const [selectedId, setSelectedId] = useState<string>(INITIAL_LOCATIONS[0].id);
  const [isDark, setIsDark] = useState<boolean>(true);
  const [search, setSearch] = useState("");

  // Simulate real-time updates: every 8 seconds, randomly tweak metrics
  useEffect(() => {
    const id = setInterval(() => {
      setLocations((prev) =>
        prev.map((loc) => ({
          ...loc,
          starScore: jitter(loc.starScore, 6),
          cloudCover: jitter(loc.cloudCover, 8),
          lightPollution: jitter(loc.lightPollution, 6),
          lastUpdated: new Date().toISOString(),
        }))
      );
    }, 8000);
    return () => clearInterval(id);
  }, []);

  // Derived: selected location
  const selected = useMemo(
    () => locations.find((l) => l.id === selectedId) ?? locations[0],
    [locations, selectedId]
  );

  // Daily recommendations: sort by starScore - cloudCover - lightPollution weighted
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

  // Filtered list
  const visibleLocations = locations.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={
        isDark
          ? "min-h-screen bg-slate-900 text-slate-100"
          : "min-h-screen bg-white text-slate-900"
      }
    >
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <header className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-extrabold">
              Night-Sky Monitoring — Chhattisgarh
            </h1>
            <p className="text-sm opacity-80">
              Star visibility, cloud cover & light pollution — realtime
              simulation
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-transparent border border-slate-600 rounded-md px-2 py-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 opacity-80"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l1.9 4.3L19 8l-3.6 2.9L16.4 16 12 13.6 7.6 16l1-5.1L5 8l5.1-1.7L12 2z" />
              </svg>
              <span className="text-sm">
                Updated: {new Date().toLocaleTimeString()}
              </span>
            </div>

            {/* Theme toggle (simple) */}
           
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left column: Map + list */}
          <section className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl p-3 shadow-md bg-gradient-to-b from-slate-800/60 to-slate-900/40">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">Map — Chhattisgarh</h2>
                <div className="flex items-center gap-2">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search location..."
                    className="px-2 py-1 rounded-md bg-slate-700/40 focus:outline-none"
                  />
                </div>
              </div>

              <GoogleMap />

              {/* Location list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                {visibleLocations.map((loc) => (
                  <div
                    key={loc.id}
                    className={`p-2 rounded-md border ${
                      selectedId === loc.id
                        ? "border-yellow-400 shadow-lg"
                        : "border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{loc.name}</div>
                        <div className="text-xs opacity-80">
                          Last updated:{" "}
                          {new Date(loc.lastUpdated).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">
                          {ratingFromScore(loc.starScore)}
                        </div>
                        <div className="text-xs opacity-80">
                          Score: {loc.starScore}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-semibold">{loc.cloudCover}%</div>
                        <div className="opacity-80">Cloud</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">
                          {loc.lightPollution}%
                        </div>
                        <div className="opacity-80">Light</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{loc.starScore}</div>
                        <div className="opacity-80">Stars</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts for selected location */}
            <div className="rounded-2xl p-3 shadow-md bg-gradient-to-b from-slate-800/60 to-slate-900/40">
              <h3 className="text-lg font-medium mb-2">
                Selected Location — {selected.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="col-span-2 p-2 bg-slate-800/40 rounded-md">
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={generateChartData(selected)}>
                      <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="starScore"
                        stroke="#f6e05e"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="cloudCover"
                        stroke="#60a5fa"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="lightPollution"
                        stroke="#c084fc"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="p-2 bg-slate-800/30 rounded-md">
                  <h4 className="text-sm font-semibold mb-2">Quick Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      Star visibility: <strong>{selected.starScore}</strong>
                    </div>
                    <div>
                      Cloud cover: <strong>{selected.cloudCover}%</strong>
                    </div>
                    <div>
                      Light pollution:{" "}
                      <strong>{selected.lightPollution}%</strong>
                    </div>
                    <div>
                      Rating:{" "}
                      <strong>{ratingFromScore(selected.starScore)}</strong>
                    </div>
                  </div>

                  <div className="mt-3">
                    <button className="px-3 py-1 rounded-md bg-yellow-400 text-slate-900 font-semibold">
                      Set alert for clear sky
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Right column: Recommendations + compare */}
          <aside className="space-y-4">
            <div className="p-3 rounded-2xl shadow-md bg-gradient-to-b from-slate-800/60 to-slate-900/40">
              <h3 className="text-lg font-semibold mb-2">
                Daily Recommendations
              </h3>
              <ol className="space-y-2">
                {recommendations.slice(0, 4).map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between gap-2 border-b pb-2"
                  >
                    <div>
                      <div className="font-medium">{r.name}</div>
                      <div className="text-xs opacity-80">Score: {r.score}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        {ratingFromScore(r.starScore)}
                      </div>
                      <div className="text-xs opacity-80">
                        Stars {r.starScore}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="p-3 rounded-2xl shadow-md bg-gradient-to-b from-slate-800/60 to-slate-900/40">
              <h3 className="text-lg font-semibold mb-2">Compare Locations</h3>
              <BarChart
                width={260}
                
                height={160}
                data={locations.map((l) => ({
                  name: l.name.split(" ")[0],
                  value: l.starScore,
                }))}
              >
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </div>

            <div className="p-3 rounded-2xl shadow-md bg-gradient-to-b from-slate-800/60 to-slate-900/40">
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="text-sm opacity-80">
                This is a frontend-focused prototype meant for the low-code
                track. Data is simulated locally; swap the data layer for real
                APIs when available.
              </p>
            </div>
          </aside>
        </div>

        {/* Footer / small print */}
        <footer className="mt-6 text-xs opacity-70">
          <div>
            Built with React + Tailwind + shadcn-style components + recharts.
            Replace the map image with a proper map provider for production.
          </div>
        </footer>
      </div>
    </div>
  );
}

/* Helper: generate 15 points of fake history for the selected location */
function generateChartData(loc: LocationMetric) {
  const now = Date.now();
  const points = Array.from({ length: 15 }).map((_, i) => {
    const t = new Date(now - (14 - i) * 60 * 60 * 1000); // every hour
    // create a smoothed trend around current values
    const star = Math.max(
      0,
      Math.min(100, Math.round(loc.starScore + Math.sin(i / 3) * 8))
    );
    const cloud = Math.max(
      0,
      Math.min(100, Math.round(loc.cloudCover + Math.cos(i / 4) * 7))
    );
    const light = Math.max(
      0,
      Math.min(100, Math.round(loc.lightPollution + Math.sin(i / 2) * 5))
    );
    return {
      time: t.getHours() + ":00",
      starScore: star,
      cloudCover: cloud,
      lightPollution: light,
    };
  });
  return points;
}
