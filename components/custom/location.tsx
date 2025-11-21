"use client";

import { useEffect, useState } from "react";

export default function LocationPage() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLocation();
  }, []);
  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setError(null);
      },
      (err) => {
        setError(err.message);
      }
    );
  };

  return (
    <div className="p-6 space-y-4">
      {coords && (
        <div className="mt-4 text-red-500">
          <p>
            <strong>Latitude:</strong> {coords.lat}
          </p>
          <p>
            <strong>Longitude:</strong> {coords.lon}
          </p>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
