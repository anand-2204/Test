import { useEffect, useRef } from "react";
import L from "leaflet";
import { createVehicleIcon, createPopupContent } from "../utils/mapHelpers";

const useVehicleMarkers = (
    mapRef,
    markersRef,
    vehicles = [],
    selectedVehicle,
    onVehicleSelect
) => {
    const hasFitBounds = useRef(false);

    useEffect(() => {
        if (!mapRef?.current || !Array.isArray(vehicles) || vehicles.length === 0)
            return;

        const map = mapRef.current;

        const validPositions = [];

        vehicles.forEach((vehicle) => {
            const imei = vehicle?.imei;

            let lat = parseFloat(vehicle?.latitude ?? vehicle?.lat);
            let lng = parseFloat(vehicle?.longitude ?? vehicle?.lng);

            // Handle "location": "lat lng" format
            if ((isNaN(lat) || isNaN(lng)) && vehicle.location) {
                const parts = vehicle.location.split(" ");
                lat = parseFloat(parts[0]);
                lng = parseFloat(parts[1]);
            }

            if (!imei || isNaN(lat) || isNaN(lng)) return;

            const position = [lat, lng];
            console.log("position", position)
            validPositions.push(position);

            const isSelected = selectedVehicle?.imei === imei;

            const icon = createVehicleIcon(
                vehicle?.ignition,
                vehicle?.speed,
                isSelected
            );

            const popupContent = createPopupContent(vehicle);

            if (markersRef?.current?.[imei]) {
                // update existing marker
                markersRef.current[imei].setLatLng(position);
                markersRef.current[imei].setIcon(icon);
                markersRef.current[imei].setPopupContent(popupContent);
            } else {
                // create new marker
                const marker = L.marker(position, { icon })
                    .addTo(map)
                    .bindPopup(popupContent);

                marker.on("click", () => {
                    onVehicleSelect?.(vehicle);
                });

                markersRef.current[imei] = marker;
            }
        });

        // fit map bounds only once
        if (!hasFitBounds.current && validPositions.length > 0) {
            map.fitBounds(validPositions, { padding: [40, 40] });
            hasFitBounds.current = true;
        }
    }, [vehicles, selectedVehicle, mapRef, markersRef, onVehicleSelect]);
};

export default useVehicleMarkers;

