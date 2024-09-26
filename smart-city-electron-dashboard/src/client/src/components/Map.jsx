import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function Map({ drones }) {
  return (
    <MapContainer center={[37.7749, -122.4194]} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {drones.map((drone) => (
        <Marker key={drone.drone_id} position={[drone.lat, drone.lng]}>
          <Popup>
            <b>{drone.drone_id}</b><br />
            Location: {drone.nearby_place}<br />
            Status: {drone.status}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
