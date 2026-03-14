import { useState, useEffect } from 'react';
import { getLastSeen } from '../../utils/helpers';

// ✅ Default vehicle — prevents undefined crash on first render
const DEFAULT_VEHICLE = {
    imei: '-',
    lat: 28.2380,
    lng: 83.9956,
    speed: 0,
    timestamp: new Date().toISOString(),
    ignition: false,
    battery: 0,
    name: 'No Vehicle Selected',
    plate: '-',
    driver: '-'
};

const useVehicleData = () => {
    const [vehicleData, setVehicleData] = useState(DEFAULT_VEHICLE); // ✅ never undefined
    const [lastSeen, setLastSeen] = useState('Just now');
    const [isOnline, setIsOnline] = useState(false); // ✅ false until a vehicle is selected

    // ✅ Update last seen timer every 30 seconds
    useEffect(() => {
        const update = () => setLastSeen(getLastSeen(vehicleData.timestamp));
        update();
        const interval = setInterval(update, 30000);
        return () => clearInterval(interval);
    }, [vehicleData.timestamp]);

    // ✅ Offline detection — if no update in 5 minutes → mark offline
    useEffect(() => {
        const checkOnline = () => {
            const diff = Date.now() - new Date(vehicleData.timestamp);
            setIsOnline(diff < 5 * 60 * 1000); // online if updated within 5 min
        };
        checkOnline();
        const interval = setInterval(checkOnline, 30000);
        return () => clearInterval(interval);
    }, [vehicleData.timestamp]);

    // ✅ Called when a vehicle is selected from sidebar
    const updateFromSocket = (newData) => {
        if (!newData) return; // safety guard
        setVehicleData(newData);
        setIsOnline(true);
    };

    // ✅ Called when marker moves along route on map
    const updatePosition = (lat, lng) => {
        setVehicleData(prev => ({
            ...prev,
            lat,
            lng,
            timestamp: new Date().toISOString()
        }));
    };

    // ✅ Reset back to default (deselect vehicle)
    const resetVehicle = () => {
        setVehicleData(DEFAULT_VEHICLE);
        setIsOnline(false);
        setLastSeen('Just now');
    };

    return {
        vehicleData,   // current vehicle data object
        lastSeen,      // "2 minutes ago" string
        isOnline,      // true/false — for LIVE badge
        updateFromSocket, // call when sidebar vehicle selected or WebSocket data arrives
        updatePosition,   // call when marker moves on map
        resetVehicle      // call to clear selection
    };
};

export default useVehicleData;