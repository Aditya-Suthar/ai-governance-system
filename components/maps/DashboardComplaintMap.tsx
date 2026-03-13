'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import L from "leaflet"

delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

interface Complaint {
  _id: string
  title: string
  latitude: number
  longitude: number
}

interface Props {
  complaints: Complaint[]
}

export default function DashboardComplaintMap({ complaints }: Props) {
  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden">
      <MapContainer
        center={[20.5937, 78.9629]} // center of India
        zoom={5}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='© OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {complaints
  .filter((c) => c.latitude !== undefined && c.longitude !== undefined)
  .map((complaint) => (
    <Marker
      key={complaint._id}
      position={[complaint.latitude, complaint.longitude]}
    >
      <Popup>
        <b>{complaint.title}</b>
      </Popup>
    </Marker>
  ))}
      </MapContainer>
    </div>
  )
}