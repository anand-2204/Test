import { useEffect } from 'react';
import L from 'leaflet';
import { createVehicleIcon, createPopupContent } from '../../utils/mapHelpers';

const useVehicleMarkers = (mapRef, markersRef, vehicles, selectedVehicle, onVehicleSelect) => {
    useEffect(() => {
        if (!mapRef.current || vehicles.length === 0) return;

        const map = mapRef.current;

        vehicles.forEach(vehicle => {
            const { imei, lat, lng } = vehicle;
            const isSelected = selectedVehicle?.imei === imei;
            const icon = createVehicleIcon(vehicle.ignition, vehicle.speed, isSelected);
            const position = [lat, lng];
            const popupContent = createPopupContent(vehicle);

            if (markersRef.current[imei]) {
                // ✅ Update existing marker
                markersRef.current[imei].setLatLng(position);
                markersRef.current[imei].setIcon(icon);
                markersRef.current[imei].setPopupContent(popupContent);
            } else {
                // ✅ Create new marker
                const marker = L.marker(position, { icon })
                    .addTo(map)
                    .bindPopup(popupContent);

                // ✅ Click marker → select vehicle
                marker.on('click', () => {
                    onVehicleSelect?.(vehicle);
                });

                markersRef.current[imei] = marker;
            }
        });

        // ✅ Fit map to show all vehicles
        const allPositions = vehicles.map(v => [v.lat, v.lng]);
        if (allPositions.length > 0) {
            map.fitBounds(allPositions, { padding: [40, 40] });
        }

    }, [vehicles, selectedVehicle]);
};

export default useVehicleMarkers;