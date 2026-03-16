import React, { useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

import MapContainer from './MapContainer';
import useMapInit from '../../hooks/useMapInit';
import useVehicleMarkers from '../../hooks/useVehicleMarkers';
import useSelectedVehicle from '../../hooks/useSelectedVehicle';
import useMapRouting from '../../hooks/useMapRouting';

const MapView = ({ vehicles = [], selectedVehicle, onVehicleSelect }) => {

    // ✅ All refs here — passed down to hooks
    const mapContainerRef = useRef(null); // DOM div
    const mapRef = useRef(null); // Leaflet map instance
    const markersRef = useRef({});   // { imei: marker }
    const destMarkerRef = useRef(null); // destination marker
    const routingControlRef = useRef(null); // route control

    // ✅ Hook 1 — initialize map + tiles
    useMapInit(mapContainerRef, mapRef);

    // ✅ Hook 2 — add/update all vehicle markers
    useVehicleMarkers(mapRef, markersRef, vehicles, selectedVehicle, onVehicleSelect);

    // ✅ Hook 3 — pan + zoom when vehicle selected
    useSelectedVehicle(mapRef, markersRef, selectedVehicle);

    // ✅ Hook 4 — click map to draw route for selected vehicle
    useMapRouting(mapRef, markersRef, destMarkerRef, routingControlRef, selectedVehicle);

    return <MapContainer mapContainerRef={mapContainerRef} />;
};

export default MapView;