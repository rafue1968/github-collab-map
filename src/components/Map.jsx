"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebaseClient";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { useEffect, useState } from "react";

const sampleUsers = [
  { id: 1, name: "Alice", lat: 40.7128, lng: -74.006, github: "alice123" },
  { id: 2, name: "Bob", lat: 34.0522, lng: -118.2437, github: "bobhub" },
  { id: 3, name: "Rafue", lat: 36.0522, lng: -120.2437, github: "rafue1968" },

];

function InvalidateMap(){
    const map = useMap();
    useEffect(() => {
        map.invalidateSize();
        const t = setTimeout(() => map.invalidateSize(), 200);
        return () => clearTimeout(t);
    }, [map]);
    return null;
}

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Map({firebaseUser}) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        (async () => {
            const snap = await getDocs(collection(db, "users"));
            const arr = snap.docs.map(d => ({
                id: d.id,
                ...d.data()
            }));
            setUsers(arr);
        })();
    }, []);

    const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

    return (
        <div className="map-root" style={{ height: "100vh", width: "100%" }}>
        <MapContainer center={[51.5072, 0.1276]} zoom={4} style={{ height: "100%", width: "100%" }}>
            <InvalidateMap />
            <TileLayer url={tileUrl} attribution='&copy; OpenStreetMap contributors' />
            {users.map((u) =>
            u.coords ? (
                <Marker key={u.id} position={[u.coords.lat, u.coords.lng]}>
                <Popup>
                    <div className="gh-card">
                        <div className="gh-card-header">
                            {u.avatar ? (
                                <img
                                 src={u.avatar} 
                                 alt={u.github_username}
                                 className="gh-avatar"
                                 />
                            )
                            : (
                                <div className="gh-avatar" />
                            )}

                            <div>
                                <div className="gh-username">{u.github_username}</div>
                                {u.location_text && (
                                    <div className="gh-meta">{u.location_text}</div>
                                )}
                            </div>
                        </div>

                        <a 
                            href={u.github_url}
                            target="_blank"
                            rel="noreferrer"
                            className="gh-link"
                        >
                            View GitHub Profile →
                        </a>
                    </div>
                    <br />
                </Popup>
                </Marker>
            ) : null
            )}
        </MapContainer>
        </div>
    );
}
