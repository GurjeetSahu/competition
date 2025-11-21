"use client";

import { useEffect, useRef } from "react";

export default function GoogleMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inject Google Maps script once
    const injectScript = () => {
      const scriptId = "google-maps-script";

      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;

        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBSW5w_ZNiZYanwKIQQMX42J8B_S794ASI&v=weekly&callback=initMap`;
        script.async = true;
        script.defer = true;

        document.body.appendChild(script);
      }
    };

    injectScript();

    // initMap callback for Google Maps API
    (window as any).initMap = async () => {
      const { Map } = await (window as any).google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await (
        window as any
      ).google.maps.importLibrary("marker");

      const position = { lat: 21.19, lng: 81.3 };

      // Create the map
      const map = new Map(mapRef.current, {
        zoom: 15,
        center: position,
        mapId: "3ab505075eaec773148cc142",
      });

      // Add advanced marker
      new AdvancedMarkerElement({
        map,
        position,
        title: "Uluru",
      });
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className="h-64 w-full bg-slate-900/40 rounded-md flex items-center justify-center border border-slate-700"
    />
  );
}
