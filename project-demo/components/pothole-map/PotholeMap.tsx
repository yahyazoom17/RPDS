"use client";

import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
} from "@/components/ui/map";

import "maplibre-gl/dist/maplibre-gl.css";

const potholes = [
  {
    id: 1,
    event: "pothole",
    lat: 12.9716,
    lon: 77.5946,
    severity: 0.82,
    speed: 32,
    timestamp: "2026-10-04T21:00:00",
  },
  {
    id: 2,
    event: "pothole",
    lat: 12.9752,
    lon: 77.5991,
    severity: 0.45,
    speed: 28,
    timestamp: "2026-10-04T21:05:00",
  },
  {
    id: 3,
    event: "pothole",
    lat: 12.9684,
    lon: 77.5902,
    severity: 0.2,
    speed: 35,
    timestamp: "2026-10-04T21:10:00",
  },
];

export default function PotholeMap() {
  return (
    <div className="h-125 w-full">
      <Map center={[potholes[0].lon, potholes[0].lat]} zoom={14}>
        {potholes.map((pothole) => (
          <MapMarker
            key={pothole.id}
            longitude={pothole.lon}
            latitude={pothole.lat}
          >
            <MarkerContent>
              <div
                className={`h-5 w-5 rounded-full border-2 border-white ${pothole.severity > 0.7 ? "bg-red-500" : pothole.severity > 0.4 ? "bg-yellow-500" : "bg-green-500"} shadow-lg`}
              />
            </MarkerContent>

            <MarkerPopup>
              <div className="space-y-1">
                <h3 className="font-semibold">🚧 Pothole</h3>

                <p>Severity: {(pothole.severity * 100).toFixed(0)}%</p>

                <p>Speed: {pothole.speed} km/h</p>

                <p>
                  📍 {pothole.lat}, {pothole.lon}
                </p>

                <p>{new Date(pothole.timestamp).toLocaleString()}</p>
              </div>
            </MarkerPopup>
          </MapMarker>
        ))}
      </Map>
    </div>
  );
}
