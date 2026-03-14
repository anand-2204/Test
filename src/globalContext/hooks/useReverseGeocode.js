
import { useState, useEffect, useRef } from 'react';

const useReverseGeocode = (lat, lng) => {
    const [address, setAddress] = useState('Fetching address...');
    const debounceTimer = useRef(null); // stores the timer

    useEffect(() => {
        if (!lat || !lng) return;

        // Clear previous timer — reset the countdown every time lat/lng changes
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // Only fire after 2 seconds of NO position changes
        debounceTimer.current = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
                    {
                        headers: {

                            'Accept-Language': 'en',
                        }
                    }
                );

                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const data = await res.json();
                setAddress(data.display_name || 'Address not found');

            } catch (err) {
                if (err.message.includes('429')) {
                    setAddress('Too many requests — try again shortly');
                } else {
                    setAddress('Address not available');
                }
                console.warn('Geocoding error:', err.message);
            }
        }, 60000);


        return () => clearTimeout(debounceTimer.current);

    }, [lat, lng]);

    return address;
};

export default useReverseGeocode;