import React, { useState, useEffect, useRef } from "react";
import {
  Moon,
  Cloud,
  MapPin,
  Star,
  Wind,
  Info,
  Navigation,
  Telescope,
  Menu,
  X,
  Calendar,
  Thermometer,
  Sparkles,
  MessageCircle,
  Send,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// --- CONFIGURATION & CONSTANTS ---
const apiKey = ""; // The execution environment provides the key at runtime.
const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";

const LOCATIONS = [
  {
    id: 1,
    name: "Mainpat",
    district: "Surguja",
    tag: "Top Pick",
    bortle: 3,
    visibility: 92,
    cloudCover: 12,
    temperature: "14°C",
    coordinates: "22.82° N, 83.29° E",
    description:
      'Known as the "Shimla of Chhattisgarh", Mainpat offers high altitude and minimal light pollution.',
    forecast: [
      { time: "8 PM", score: 85 },
      { time: "9 PM", score: 88 },
      { time: "10 PM", score: 92 },
      { time: "11 PM", score: 94 },
      { time: "12 AM", score: 95 },
      { time: "1 AM", score: 92 },
      { time: "2 AM", score: 88 },
      { time: "3 AM", score: 75 },
      { time: "4 AM", score: 70 },
    ],
  },
  {
    id: 2,
    name: "Barnawapara",
    district: "Mahasamund",
    tag: "Good",
    bortle: 4,
    visibility: 78,
    cloudCover: 25,
    temperature: "21°C",
    coordinates: "21.40° N, 82.40° E",
    description:
      "A wildlife sanctuary with decent dark skies, though some glow from nearby towns is visible.",
    forecast: [
      { time: "8 PM", score: 70 },
      { time: "9 PM", score: 75 },
      { time: "10 PM", score: 78 },
      { time: "11 PM", score: 80 },
      { time: "12 AM", score: 82 },
      { time: "1 AM", score: 78 },
      { time: "2 AM", score: 75 },
      { time: "3 AM", score: 70 },
      { time: "4 AM", score: 60 },
    ],
  },
  {
    id: 3,
    name: "Raipur City",
    district: "Raipur",
    tag: "Poor",
    bortle: 8,
    visibility: 35,
    cloudCover: 40,
    temperature: "26°C",
    coordinates: "21.25° N, 81.62° E",
    description:
      "Urban center with significant light pollution. Only bright planets and the moon are visible.",
    forecast: [
      { time: "8 PM", score: 20 },
      { time: "9 PM", score: 25 },
      { time: "10 PM", score: 30 },
      { time: "11 PM", score: 32 },
      { time: "12 AM", score: 35 },
      { time: "1 AM", score: 34 },
      { time: "2 AM", score: 32 },
      { time: "3 AM", score: 28 },
      { time: "4 AM", score: 25 },
    ],
  },
  {
    id: 4,
    name: "Chitrakote",
    district: "Bastar",
    tag: "Excellent",
    bortle: 2,
    visibility: 95,
    cloudCover: 5,
    temperature: "19°C",
    coordinates: "19.12° N, 81.70° E",
    description:
      "Near the widest waterfalls in India, this location offers pristine dark skies perfect for astrophotography.",
    forecast: [
      { time: "8 PM", score: 90 },
      { time: "9 PM", score: 93 },
      { time: "10 PM", score: 95 },
      { time: "11 PM", score: 97 },
      { time: "12 AM", score: 98 },
      { time: "1 AM", score: 98 },
      { time: "2 AM", score: 96 },
      { time: "3 AM", score: 90 },
      { time: "4 AM", score: 85 },
    ],
  },
];

// --- UTILITIES ---
const getScoreColor = (score) => {
  if (score >= 80) return "text-emerald-400";
  if (score >= 50) return "text-yellow-400";
  return "text-red-400";
};

const getBortleColor = (bortle) => {
  if (bortle <= 3) return "text-emerald-400";
  if (bortle <= 5) return "text-yellow-400";
  return "text-red-400";
};

const callGeminiAPI = async (prompt) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from the stars."
    );
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Communications with the satellite failed.";
  }
};

// --- SUB-COMPONENTS ---

const Navbar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => (
  <nav className="border-b border-slate-800 bg-[#0b0f19]/95 sticky top-0 z-50 backdrop-blur-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.3)]">
          <Telescope className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-tight text-white leading-none">
            C.G. SkyWatch
          </h1>
          <p className="text-[10px] text-indigo-400 tracking-wider uppercase">
            Chhattisgarh Stargazing
          </p>
        </div>
      </div>

      <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
        <button className="text-white border-b-2 border-indigo-500 px-1 py-4">
          Dashboard
        </button>
        <button className="hover:text-indigo-400 transition-colors px-1 py-4">
          Light Pollution Map
        </button>
        <button className="hover:text-indigo-400 transition-colors px-1 py-4">
          Events
        </button>
        <button className="hover:text-indigo-400 transition-colors px-1 py-4">
          Gallery
        </button>
      </div>

      <div className="hidden md:block">
        <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>Plan Trip</span>
        </button>
      </div>

      <button
        className="md:hidden p-2 text-slate-400 hover:text-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X /> : <Menu />}
      </button>
    </div>
    {isMobileMenuOpen && (
      <div className="md:hidden border-t border-slate-800 bg-[#0b0f19]">
        <div className="px-4 py-3 space-y-2">
          <button className="block w-full text-left px-3 py-2 rounded-md text-white bg-indigo-900/20 text-base font-medium">
            Dashboard
          </button>
          <button className="block w-full text-left px-3 py-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 text-base font-medium">
            Map
          </button>
        </div>
      </div>
    )}
  </nav>
);

const LocationSidebar = ({ locations, selectedLoc, onSelect }) => (
  <div className="lg:col-span-4 space-y-6">
    <div className="bg-slate-900/30 rounded-2xl p-4 border border-slate-800 backdrop-blur-sm">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2 flex items-center gap-2">
        <MapPin className="w-4 h-4" /> Select Region
      </h3>
      <div className="space-y-3">
        {locations.map((loc) => (
          <button
            key={loc.id}
            onClick={() => onSelect(loc)}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group relative overflow-hidden ${
              selectedLoc.id === loc.id
                ? "bg-gradient-to-r from-indigo-900/40 to-purple-900/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                : "bg-[#0f1422] border-slate-800 hover:border-slate-600 hover:bg-slate-800/50"
            }`}
          >
            {selectedLoc.id === loc.id && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
            )}
            <div className="flex justify-between items-start mb-1">
              <div>
                <span
                  className={`font-semibold block ${
                    selectedLoc.id === loc.id ? "text-white" : "text-slate-300"
                  }`}
                >
                  {loc.name}
                </span>
                <span className="text-xs text-slate-500">{loc.district}</span>
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${
                  loc.tag === "Excellent" || loc.tag === "Top Pick"
                    ? "bg-emerald-950/30 text-emerald-400 border-emerald-500/20"
                    : loc.tag === "Poor"
                    ? "bg-red-950/30 text-red-400 border-red-500/20"
                    : "bg-blue-950/30 text-blue-400 border-blue-500/20"
                }`}
              >
                {loc.tag}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500 mt-3">
              <span className="flex items-center gap-1 bg-slate-950/50 px-2 py-1 rounded">
                <Cloud className="w-3 h-3" /> {loc.cloudCover}%
              </span>
              <span className="flex items-center gap-1 bg-slate-950/50 px-2 py-1 rounded">
                <Star className="w-3 h-3" /> Bortle {loc.bortle}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
    <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative overflow-hidden shadow-lg shadow-indigo-900/20 hidden lg:block">
      <div className="relative z-10">
        <h3 className="font-bold text-lg mb-2">Join the Community</h3>
        <p className="text-indigo-100 text-sm mb-4">
          Upload your astrophotography from {selectedLoc.name} and get featured!
        </p>
        <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors">
          Upload Photo
        </button>
      </div>
      <Star className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 rotate-12" />
    </div>
  </div>
);

const DashboardHero = ({ selectedLoc }) => (
  <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 sm:p-8 relative overflow-hidden backdrop-blur-sm">
    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

    <div className="relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              {selectedLoc.name}
            </h1>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${selectedLoc.coordinates}`}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 hover:text-indigo-300 p-1"
            >
              <Navigation className="w-5 h-5" />
            </a>
          </div>
          <p className="text-slate-400 text-sm flex items-center gap-2 max-w-md">
            {selectedLoc.description}
          </p>
        </div>
        <div className="mt-6 md:mt-0 pl-0 md:pl-8 border-l-0 md:border-l border-slate-800">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Stargazing Index
          </div>
          <div className="flex items-baseline gap-2">
            <div
              className={`text-5xl font-bold ${getScoreColor(
                selectedLoc.visibility
              )}`}
            >
              {selectedLoc.visibility}
            </div>
            <div className="text-slate-500 font-medium">/ 100</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          icon={Moon}
          color="indigo"
          label="Light Pollution"
          value={`Class ${selectedLoc.bortle}`}
          sub="Bortle Scale"
          valueColor={getBortleColor(selectedLoc.bortle)}
        />
        <MetricCard
          icon={Cloud}
          color="blue"
          label="Cloud Cover"
          value={`${selectedLoc.cloudCover}%`}
          sub="Current Status"
        />
        <MetricCard
          icon={Wind}
          color="emerald"
          label="Seeing"
          value={selectedLoc.visibility > 80 ? "Stable" : "Turbulent"}
          sub="Atmosphere"
        />
        <MetricCard
          icon={Thermometer}
          color="rose"
          label="Temp"
          value={selectedLoc.temperature}
          sub="Dew Point: 12°C"
        />
      </div>
    </div>
  </div>
);

const MetricCard = ({
  icon: Icon,
  color,
  label,
  value,
  sub,
  valueColor = "text-white",
}) => {
  const colors = {
    indigo: "text-indigo-400",
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    rose: "text-rose-400",
  };
  return (
    <div className="bg-[#0b0f19]/80 p-4 rounded-xl border border-slate-800/60 hover:border-slate-700 transition-colors">
      <div className="text-slate-500 text-xs mb-2 flex items-center gap-1.5 uppercase tracking-wide font-semibold">
        <Icon className={`w-3.5 h-3.5 ${colors[color]}`} /> {label}
      </div>
      <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
      <div className="text-[10px] text-slate-600 mt-1">{sub}</div>
    </div>
  );
};

const VisibilityChart = ({ data }) => (
  <div className="bg-[#0f1422] rounded-2xl border border-slate-800 p-6">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-sm font-semibold text-white flex items-center gap-2">
        <Star className="w-4 h-4 text-indigo-400" /> Visibility Forecast
        (Tonight)
      </h3>
      <div className="flex gap-2 text-xs">
        <span className="flex items-center gap-1 text-slate-400">
          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div> Visibility
        </span>
      </div>
    </div>
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e293b"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: "8px",
              color: "#fff",
            }}
            itemStyle={{ color: "#818cf8" }}
            cursor={{
              stroke: "#334155",
              strokeWidth: 1,
              strokeDasharray: "4 4",
            }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#6366f1"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorScore)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const ObservationGuide = ({ selectedLoc }) => {
  const [aiPlan, setAiPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset AI plan when location changes
  useEffect(() => {
    setAiPlan(null);
  }, [selectedLoc]);

  const generateItinerary = async () => {
    setIsLoading(true);
    const prompt = `
      Act as an expert astronomer guide. 
      Create a short, bullet-point stargazing itinerary for tonight at ${selectedLoc.name}, Chhattisgarh.
      Context: Bortle Scale ${selectedLoc.bortle}, Cloud Cover ${selectedLoc.cloudCover}%.
      Suggest 3 specific celestial objects visible tonight (planets, constellations, or deep sky objects) suitable for this light pollution level.
      Keep it under 80 words. Use emojis.
    `;
    const result = await callGeminiAPI(prompt);
    setAiPlan(result);
    setIsLoading(false);
  };

  return (
    <div className="p-6 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-900/20 to-transparent backdrop-blur-sm flex flex-col">
      <h3 className="text-md font-bold text-white mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-indigo-400" />
        Observation Guide
      </h3>
      <div className="flex-grow space-y-3">
        {isLoading ? (
          <div className="flex items-center gap-2 text-indigo-300 text-sm py-4 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" /> Scanning the skies...
          </div>
        ) : aiPlan ? (
          <div className="prose prose-invert prose-sm">
            <p className="text-slate-300 text-sm whitespace-pre-line">
              {aiPlan}
            </p>
          </div>
        ) : (
          <p className="text-slate-400 text-sm">
            Best viewing window is usually <strong>11:00 PM - 2:00 AM</strong>.
            Click below for a live AI-generated itinerary based on{" "}
            {selectedLoc.name}'s current Bortle scale.
          </p>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-slate-800/50">
        <button
          onClick={generateItinerary}
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Generating..." : "✨ Generate Tonight's Plan"}
        </button>
      </div>
    </div>
  );
};

const LiveAlerts = () => (
  <div className="p-6 rounded-2xl border border-slate-800 bg-[#0f1422]">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-md font-bold text-white">Live Alerts</h3>
      <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-2 py-1 rounded border border-emerald-500/20">
        LIVE
      </span>
    </div>
    <div className="space-y-4">
      <div className="flex gap-3 items-start group cursor-pointer">
        <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500 shrink-0 animate-pulse"></div>
        <div>
          <p className="text-sm text-slate-300 group-hover:text-white transition-colors">
            Sky clearing up rapidly near Chitrakote.
          </p>
          <p className="text-[10px] text-slate-500 mt-1">
            15 mins ago • 34 confirmations
          </p>
        </div>
      </div>
      <div className="flex gap-3 items-start group cursor-pointer">
        <div className="w-2 h-2 mt-2 rounded-full bg-yellow-500 shrink-0"></div>
        <div>
          <p className="text-sm text-slate-300 group-hover:text-white transition-colors">
            ISS Flyover visible from Raipur at 8:45 PM.
          </p>
          <p className="text-[10px] text-slate-500 mt-1">
            2 hours ago • Automated
          </p>
        </div>
      </div>
    </div>
  </div>
);

const AIChatBot = ({ selectedLoc }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I am your Cosmic Assistant. Ask me anything about the stars in Chhattisgarh!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const prompt = `
      You are a helpful astronomy assistant for the Chhattisgarh SkyWatch app.
      The user is currently viewing data for: ${selectedLoc.name}.
      User Question: "${input}"
      Provide a concise, friendly answer (max 2 sentences).
    `;

    const aiText = await callGeminiAPI(prompt);
    setMessages((prev) => [...prev, { role: "assistant", text: aiText }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {isOpen && (
        <div className="w-80 md:w-96 bg-[#0f1422] border border-slate-700 rounded-2xl shadow-2xl shadow-black overflow-hidden flex flex-col transition-all animate-in slide-in-from-bottom-10 fade-in duration-200">
          <div className="bg-indigo-900/30 p-4 border-b border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Cosmic Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-[#0b0f19]/90">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl text-sm ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 px-4 py-2 rounded-xl rounded-bl-none border border-slate-700 flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
                  <span className="text-xs text-slate-400">
                    Consulting the stars...
                  </span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-3 bg-[#0f1422] border-t border-slate-700 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about stars..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-lg shadow-indigo-900/40 transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
        {!isOpen && <span className="font-medium text-sm pr-1">Ask AI</span>}
      </button>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
const App = () => {
  const [selectedLoc, setSelectedLoc] = useState(LOCATIONS[0]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-200 font-sans selection:bg-indigo-500/30 pb-12 relative overflow-x-hidden">
      <Navbar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Status */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Live Monitoring
            </h2>
            <p className="text-slate-400 text-sm">
              Real-time atmospheric data across Chhattisgarh
            </p>
          </div>
          <div className="text-right text-xs font-mono text-slate-500 bg-slate-900/50 px-3 py-1 rounded border border-slate-800">
            UPDATED:{" "}
            {currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Sidebar */}
          <LocationSidebar
            locations={LOCATIONS}
            selectedLoc={selectedLoc}
            onSelect={setSelectedLoc}
          />

          {/* RIGHT: Main Dashboard */}
          <div className="lg:col-span-8 space-y-6">
            <DashboardHero selectedLoc={selectedLoc} />
            <VisibilityChart data={selectedLoc.forecast} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ObservationGuide selectedLoc={selectedLoc} />
              <LiveAlerts />
            </div>
          </div>
        </div>
      </main>

      <AIChatBot selectedLoc={selectedLoc} />
    </div>
  );
};

export default App;
