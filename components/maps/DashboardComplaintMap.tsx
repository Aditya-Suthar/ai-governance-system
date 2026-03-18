'use client'


import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useRouter } from "next/navigation"

import { useEffect } from "react"
import { useMap } from "react-leaflet"
import "leaflet.heat"

import 'react-leaflet-cluster/dist/assets/MarkerCluster.css'
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css'
import MarkerClusterGroup from "react-leaflet-cluster"
import L from "leaflet"



interface Complaint {
  _id: string
  title: string
  latitude: number
  longitude: number
}

interface Props {
  complaints: Complaint[]
}

function HeatLayer({ complaints }: Props) {
  const map = useMap()

  useEffect(() => {
    const points = complaints
      .filter(c => typeof c.latitude === "number" && typeof c.longitude === "number")
      .map(c => [c.latitude, c.longitude, 0.6])

    const heat = (L as any).heatLayer(points, {
  radius: 45,
  blur: 30,
  maxZoom: 17
})

    heat.addTo(map)

    return () => {
      map.removeLayer(heat)
    }
  }, [complaints, map])

  return null
}

delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})



export default function DashboardComplaintMap({ complaints }: Props) 
{const router = useRouter()
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
        <HeatLayer complaints={complaints} />

        <MarkerClusterGroup>
  {complaints.map((complaint: any) => {
    let lat = complaint.latitude;
let lng = complaint.longitude;

if (lat === undefined || lng === undefined) {
  lat = complaint.location?.lat;
  lng = complaint.location?.lng;
}

lat = Number(lat);
lng = Number(lng);

    if (
      typeof lat !== "number" ||
      typeof lng !== "number"
    ) {
      return null
    }

    return (
      <Marker
        key={complaint._id}
        position={[lat, lng]}
        eventHandlers={{
          click: () => {
            router.push("/admin/complaints/" + complaint._id)
          }
        }}
      >
        <Popup>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => router.push("/admin/complaints/" + complaint._id)}
          >
            <b>{complaint.title}</b>
            <br />
            Click to open complaint
          </div>
        </Popup>
      </Marker>
    )
  })}
</MarkerClusterGroup>
      </MapContainer>
    </div>
  )
}