import { useEffect } from 'react';

const useSelectedVehicle = (mapRef, markersRef, selectedVehicle) => {
    useEffect(() => {
        if (!mapRef.current || !selectedVehicle) return;

        const lat = parseFloat(selectedVehicle.latitude || selectedVehicle.lat);
        const lng = parseFloat(selectedVehicle.longitude || selectedVehicle.lng);
        const { imei } = selectedVehicle;

        if (isNaN(lat) || isNaN(lng)) return;

        //  Pan + zoom to selected vehicle
        mapRef.current.setView([lat, lng], 15, { animate: true });

        // Open its popup
        if (markersRef.current[imei]) {
            markersRef.current[imei].openPopup();
        }

    }, [selectedVehicle]);
};

export default useSelectedVehicle;