import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

const VehicleTracking = () => {
    const mapRef = useRef(null);
    const taxiMarkerRef = useRef(null);
    const destMarkerRef = useRef(null);
    const routingControlRef = useRef(null);// remembers the drawn route



    useEffect(() => {

        if (mapRef.current) return;

        const startLatLng = [28.2380, 83.9956];

        // Initialize map
        const map = L.map('map').setView(startLatLng, 11);
        mapRef.current = map;

        // Tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Taxi icon
        const taxiIcon = L.icon({
            iconUrl: 'taxi.png',
            iconSize: [20, 20]
        });

        // Taxi marker
        taxiMarkerRef.current = L.marker(startLatLng, { icon: taxiIcon }).addTo(map);

        // Map click event
        // map.on('click', function (e) {
        //     const destLatLng = [e.latlng.lat, e.latlng.lng];

        //     // Reset taxi to start
        //     taxiMarkerRef.current.setLatLng(startLatLng);

        //     // Update or create destination marker
        //     if (destMarkerRef.current) {
        //         destMarkerRef.current.setLatLng(destLatLng);
        //     } else {
        //         destMarkerRef.current = L.marker(destLatLng).addTo(map);
        //     }

        //     // Remove previous routing control
        //     if (routingControlRef.current) {
        //         map.removeControl(routingControlRef.current);
        //     }

        //     // Create new routing control
        //     routingControlRef.current = L.Routing.control({
        //         waypoints: [
        //             L.latLng(startLatLng[0], startLatLng[1]), //start
        //             L.latLng(destLatLng[0], destLatLng[1])  // destination
        //         ],
        //         routeWhileDragging: false,
        //         show: true
        //     })
        //         .on('routesfound', function (e) {
        //             const route = e.routes[0].coordinates;

        //             // Animate taxi along route
        //             route.forEach(function (coord, index) {
        //                 setTimeout(function () {
        //                     taxiMarkerRef.current.setLatLng([coord.lat, coord.lng]);
        //                 }, 50 * index);
        //             });
        //         })
        //         .addTo(map);
        // }
         // );


        // Cleanup on unmount
        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    return (
        <>
            <h3>Taxi Routing Map</h3>


            <div id="map" style={{ height: '500px', width: '100%' }}></div>
        </>
    );
};

export default VehicleTracking;