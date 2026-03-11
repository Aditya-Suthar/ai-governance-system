'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

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

        {complaints.map((complaint) => {
  const lat = complaint.latitude ?? 29.9695
  const lng = complaint.longitude ?? 76.8783

  return (
    <Marker key={complaint._id} position={[lat, lng]}>
      <Popup>
        <b>{complaint.title}</b>
      </Popup>
    </Marker>
  )
})}
      </MapContainer>
    </div>
  )
}