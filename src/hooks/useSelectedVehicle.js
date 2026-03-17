
import { useEffect } from "react";

const useSelectedVehicle = (mapRef, markersRef, selectedVehicle) => {
    useEffect(() => {
        if (!mapRef?.current || !selectedVehicle) return;

        let lat = parseFloat(
            selectedVehicle.latitude ?? selectedVehicle.lat
        );
        let lng = parseFloat(
            selectedVehicle.longitude ?? selectedVehicle.lng
        );

        // Handle "location": "lat lng" format
        if ((isNaN(lat) || isNaN(lng)) && selectedVehicle.location) {
            const parts = selectedVehicle.location.split(" ");
            lat = parseFloat(parts[0]);
            lng = parseFloat(parts[1]);
        }

        const imei = selectedVehicle?.imei;

        if (!imei || isNaN(lat) || isNaN(lng)) return;

        // Pan + zoom to selected vehicle
        mapRef.current.setView([lat, lng], 15, { animate: true });

        // Open popup with slight delay to ensure marker is updated
        const timer = setTimeout(() => {
            const marker = markersRef?.current?.[imei];
            if (marker && mapRef.current) {
                marker.openPopup();
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [selectedVehicle, mapRef, markersRef]);
};

export default useSelectedVehicle;
