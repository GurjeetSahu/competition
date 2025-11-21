"use client";

import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-950">
        <div className="p-4 border-b border-slate-800">
          <h1 className="text-xl font-bold">NightSky</h1>
          <p className="text-xs opacity-60">Chhattisgarh Monitoring</p>
        </div>

        <nav className="flex-1 p-3 space-y-2 text-sm">
          <button className="w-full text-left px-3 py-2 rounded-md bg-slate-800/50 hover:bg-slate-700">
            Dashboard
          </button>
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-800/40">
            Map View
          </button>
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-800/40">
            Compare
          </button>
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-800/40">
            About
          </button>
        </nav>

        <div className="p-3 border-t border-slate-800 text-xs opacity-70">
          © 2025 NightSky Dashboard
        </div>
      </aside>

      {/* Right Section */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/60 backdrop-blur">
          <div>
            <h2 className="font-semibold text-lg">Dashboard</h2>
            <p className="text-xs opacity-60">Star visibility, clouds & light pollution</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <input
              placeholder="Search location..."
              className="px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-sm"
            />

            {/* Theme Toggle */}
            <button className="w-10 h-5 rounded-full bg-slate-700 relative">
              <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-0.5" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
