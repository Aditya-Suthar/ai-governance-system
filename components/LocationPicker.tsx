'use client'

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";



export default function LocationPicker({
  setLocation,
}: {
  setLocation: (location: { lat: number; lng: number }) => void;
}) {

  const [position, setPosition] = useState(null);

  function LocationMarker() {
    useMapEvents({
      click(e: any) {
        setPosition(e.latlng);
        setLocation(e.latlng);
      },
    });

    return position === null ? null : <Marker position={position} />;
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