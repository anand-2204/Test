import { useState, useEffect } from 'react';
import { getLastSeen } from '../utils/helpers';
import VEHICLES from '../constants/vehicleData';

// Normalize raw JSON → internal shape
const normalizeVehicle = (v) => ({
    imei: v.imei,
    lat: parseFloat(v.latitude),   //  "9.931233" → 9.931233
    lng: parseFloat(v.longitude),  // "76.267303" → 76.267303
    speed: v.speed ?? 0,
    timestamp: v.time,
    ignition: v.ignition ?? false,
    plate: v.vehicle,
    city: v.city,
});

const DEFAULT_VEHICLE = {
    imei: '-',
    lat: 10.619671,   //  center of Kerala, not Nepal
    lng: 76.206298,
    speed: 0,
    timestamp: new Date().toISOString(),
    ignition: false,
    plate: 'No Vehicle Selected',
    city: '-',
};

const useVehicleData = () => {
    const [vehicles, setVehicles] = useState([]);          //  full list for sidebar
    const [vehicleData, setVehicleData] = useState(DEFAULT_VEHICLE);
    const [lastSeen, setLastSeen] = useState('Just now');
    const [isOnline, setIsOnline] = useState(false);

    // Load + normalize all vehicles on mount
    useEffect(() => {
        setVehicles(VEHICLES.map(normalizeVehicle));
    }, []);

    //  Last seen timer
    useEffect(() => {
        const update = () => setLastSeen(getLastSeen(vehicleData.timestamp));
        update();
        const interval = setInterval(update, 30000);
        return () => clearInterval(interval);
    }, [vehicleData.timestamp]);

    //  Online detection
    useEffect(() => {
        const checkOnline = () => {
            const diff = Date.now() - new Date(vehicleData.timestamp);
            setIsOnline(diff < 5 * 60 * 1000);
        };
        checkOnline();
        const interval = setInterval(checkOnline, 30000);
        return () => clearInterval(interval);
    }, [vehicleData.timestamp]);

    // Fix — normalize before storing so lat/lng are always numbers
    const selectVehicle = (rawVehicle) => {
        if (!rawVehicle) return;
        const normalized = normalizeVehicle(rawVehicle); //  this was the missing step
        setVehicleData(normalized);
        setIsOnline(true);
    };

    const updatePosition = (lat, lng) => {
        setVehicleData(prev => ({
            ...prev,
            lat,
            lng,
            timestamp: new Date().toISOString()
        }));
    };

    const resetVehicle = () => {
        setVehicleData(DEFAULT_VEHICLE);
        setIsOnline(false);
        setLastSeen('Just now');
    };

    return {
        vehicles,       //  for sidebar list
        vehicleData,    // selected vehicle — lat/lng always numbers
        lastSeen,
        isOnline,
        selectVehicle,  //  replaces updateFromSocket
        updatePosition,
        resetVehicle,
    };
};

export default useVehicleData;