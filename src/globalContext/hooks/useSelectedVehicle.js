import { useEffect } from 'react';

const useSelectedVehicle = (mapRef, markersRef, selectedVehicle) => {
    useEffect(() => {
        if (!mapRef.current || !selectedVehicle) return;

        const { lat, lng, imei } = selectedVehicle;

        // ✅ Pan + zoom to selected vehicle
        mapRef.current.setView([lat, lng], 15, { animate: true });

        // ✅ Open its popup
        if (markersRef.current[imei]) {
            markersRef.current[imei].openPopup();
        }

    }, [selectedVehicle]);
};

export default useSelectedVehicle;