'use client'

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

import L from "leaflet";


const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function LocationPicker({
  setLocation,
}: {
  setLocation: (location: { lat: number; lng: number }) => void;
}) {

  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  function LocationMarker() {
    useMapEvents({
      click(e: any) {
        setPosition(e.latlng);
        setLocation(e.latlng);
      },
    });

    return position === null
  ? null
  : <Marker position={[position.lat, position.lng]} icon={icon}  />;
  }

  return (
    <MapContainer
  center={[28.6139, 77.2090]}
  zoom={13}
  style={{ height: "400px", width: "100%" }}
  scrollWheelZoom={true}
>
      <TileLayer
        attribution="OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker />

    </MapContainer>
  );
}