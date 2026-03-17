
import { useState, useEffect, useRef } from "react";

const useReverseGeocode = (lat, lng) => {
    const [address, setAddress] = useState("Fetching address...");
    const debounceTimer = useRef(null);
    const cache = useRef({});

    useEffect(() => {
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);

        // prevent invalid coordinates
        if (isNaN(latitude) || isNaN(longitude)) return;

        const key = `${latitude.toFixed(5)},${longitude.toFixed(5)} `;

        // return cached address
        if (cache.current[key]) {
            setAddress(cache.current[key]);
            return;
        }

        // clear previous timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
                    {
                        headers: {
                            "Accept-Language": "en",
                            "User-Agent": "vehicle-tracker-app",
                        },
                    }
                );

                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const data = await res.json();
                const addr = data?.address || {};

                const cityName =
                    addr.city ||
                    addr.town ||
                    addr.village ||
                    addr.county ||
                    "Unknown Area";

                const state = addr.state || "";
                const country = addr.country || "";

                const result = [cityName, state, country].filter(Boolean).join(", ");

                cache.current[key] = result;
                setAddress(result);
            } catch (err) {
                if (err.message.includes("429")) {
                    setAddress("Too many requests — try again shortly");
                } else {
                    setAddress("Address not available");
                }

                console.warn("Geocoding error:", err.message);
            }
        }, 2000);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
                debounceTimer.current = null;
            }
        };
    }, [lat, lng]);

    return address;
};

export default useReverseGeocode;

