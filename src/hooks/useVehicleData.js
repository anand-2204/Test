import { useState, useEffect } from "react";
import { getLastSeen } from "../utils/helpers";
import { useSelector } from "react-redux";

// Normalize raw JSON → internal shape
const normalizeVehicle = (v) => {
    let lat = v.latitude;
    let lng = v.longitude;

    // handle "location": "9.975638 76.352355"
    if (!lat && !lng && v.location) {
        const parts = v.location.split(" ");
        lat = parts[0];
        lng = parts[1];
    }

    return {
        imei: v.imei,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        speed: v.speed ?? 0,
        timestamp: v.time,
        ignition: v.ignition ?? false,
        plate: v.vehicle,
        city: v.city ?? "-",
    };
};

const DEFAULT_VEHICLE = {
    imei: "-",
    lat: 10.619671,
    lng: 76.206298,
    speed: 0,
    timestamp: new Date().toISOString(),
    ignition: false,
    plate: "No Vehicle Selected",
    city: "-",
};

const useVehicleData = () => {
    const [vehicles, setVehicles] = useState([]);
    const [vehicleData, setVehicleData] = useState(DEFAULT_VEHICLE);
    const [lastSeen, setLastSeen] = useState("Just now");
    const [isOnline, setIsOnline] = useState(false);

    const { gpsData } = useSelector((state) => state.gpsData || { gpsData: [] });

    // Load + normalize vehicles whenever Redux updates
    useEffect(() => {
        if (!gpsData || !Array.isArray(gpsData)) return;

        const normalized = gpsData.map(normalizeVehicle);
        setVehicles(normalized);
    }, [gpsData]);

    // Last seen timer
    useEffect(() => {
        const update = () => setLastSeen(getLastSeen(vehicleData.timestamp));

        update();
        const interval = setInterval(update, 30000);

        return () => clearInterval(interval);
    }, [vehicleData.timestamp]);

    // Online detection
    useEffect(() => {
        const checkOnline = () => {
            const diff = Date.now() - new Date(vehicleData.timestamp);
            setIsOnline(diff < 5 * 60 * 1000);
        };

        checkOnline();
        const interval = setInterval(checkOnline, 30000);

        return () => clearInterval(interval);
    }, [vehicleData.timestamp]);

    const selectVehicle = (rawVehicle) => {
        if (!rawVehicle) return;

        const normalized = normalizeVehicle(rawVehicle);
        setVehicleData(normalized);
        setIsOnline(true);
    };

    const updatePosition = (lat, lng) => {
        setVehicleData((prev) => ({
            ...prev,
            lat,
            lng,
            timestamp: new Date().toISOString(),
        }));
    };

    const resetVehicle = () => {
        setVehicleData(DEFAULT_VEHICLE);
        setIsOnline(false);
        setLastSeen("Just now");
    };

    return {
        vehicles,
        vehicleData,
        lastSeen,
        isOnline,
        selectVehicle,
        updatePosition,
        resetVehicle,
    };
};

export default useVehicleData;
