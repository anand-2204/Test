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

    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef({});
    const destMarkerRef = useRef(null);
    const routingControlRef = useRef(null);

    useMapInit(mapContainerRef, mapRef);

    useVehicleMarkers(mapRef, markersRef, vehicles, selectedVehicle, onVehicleSelect);
    useSelectedVehicle(mapRef, markersRef, selectedVehicle);


    useMapRouting(mapRef, markersRef, destMarkerRef, routingControlRef, selectedVehicle);

    return <MapContainer mapContainerRef={mapContainerRef} />;
};

export default MapView;