import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const VehicleTracking = ({ selectedVehicle }) => {
    const mapRef = useRef(null);
    const taxiMarkerRef = useRef(null);

    useEffect(() => {
        if (mapRef.current) return;

        const startLatLng = [28.238, 83.9956];

        const map = L.map("map").setView(startLatLng, 11);
        mapRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        const taxiIcon = L.icon({
            iconUrl: "taxi.png",
            iconSize: [20, 20],
        });

        taxiMarkerRef.current = L.marker(startLatLng, { icon: taxiIcon }).addTo(map);

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    // 🔹 Update marker when vehicle changes
    useEffect(() => {
        if (!selectedVehicle || !mapRef.current) return;

        const lat = parseFloat(selectedVehicle.latitude ?? selectedVehicle.lat);
        const lng = parseFloat(selectedVehicle.longitude ?? selectedVehicle.lng);

        if (isNaN(lat) || isNaN(lng)) return;

        const position = [lat, lng];

        // move marker
        taxiMarkerRef.current.setLatLng(position);

        // move map
        mapRef.current.setView(position, 15, { animate: true });
    }, [selectedVehicle]);

    return (
        <>
            <h3>Taxi Routing Map</h3>
            <div id="map" style={{ height: "500px", width: "100%" }}></div>
        </>
    );
};

export default VehicleTracking;

