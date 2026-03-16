import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { createVehicleIcon, createPopupContent } from '../utils/mapHelpers';

const useVehicleMarkers = (mapRef, markersRef, vehicles, selectedVehicle, onVehicleSelect) => {
      const hasFitBounds = useRef(false);

    useEffect(() => {
        if (!mapRef.current || vehicles.length === 0) return;

        const map = mapRef.current;

        vehicles.forEach(vehicle => {
           const { imei } = vehicle;
            const lat = parseFloat(vehicle.latitude || vehicle.lat);
            const lng = parseFloat(vehicle.longitude || vehicle.lng);
           
            if(isNaN(lat) || isNaN(lng)) return;

            const isSelected = selectedVehicle?.imei === imei;
            const icon = createVehicleIcon(vehicle.ignition, vehicle.speed, isSelected);
            const position = [lat, lng];
            const popupContent = createPopupContent(vehicle);

             

            if (markersRef.current[imei]) {
                //  Update existing marker
                markersRef.current[imei].setLatLng(position);
                markersRef.current[imei].setIcon(icon);
                markersRef.current[imei].setPopupContent(popupContent);
            } else {
                // Create new marker
                const marker = L.marker(position, { icon })
                    .addTo(map)
                    .bindPopup(popupContent);

                // Click marker select vehicle
                marker.on('click', () => {
                    onVehicleSelect?.(vehicle);
                });

                markersRef.current[imei] = marker;
            }
        });
         
        if(!hasFitBounds.current){
            const validPositions = vehicles
            .map(v=>[parseFloat(v.latitude || v.lat), parseFloat(v.longitude || v.lng)])
            .filter(([lat, lng]) => !isNaN(lat) && !isNaN(lng));
            
    
        // Fit map to show all vehicles

        if (validPositions.length > 0) {
            map.fitBounds(validPositions, { padding: [40, 40] });
            hasFitBounds.current = true;
        }
    }

    }, [vehicles, selectedVehicle]);
};

export default useVehicleMarkers;