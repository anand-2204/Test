
import { useState, useEffect, useRef } from 'react';

const useReverseGeocode = (lat, lng) => {
    const [address, setAddress] = useState('Fetching address...');
    const debounceTimer = useRef(null); // stores the timer
    const cache = useRef({}); //to avoid repeat API calls
   
   
    useEffect(() => {
        if (!lat || !lng) return;
       
        const key = `${parseFloat(lat).toFixed(5)},${parseFloat(lng).toFixed(5)}`;
         
        //Return cached result instantly no api call needed
        if(cache.current[key]){
             setAddress(cache.current[key]);
             return;
        }
       
        if(debounceTimer.current){
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
                const {city, town, village, county, state, country} = data.address;                
                 const cityName = city || town || village || county || 'Unknown Area';
                 const result = `${cityName}, ${state}, ${country}`; 
               
                 cache.current[key] = result;
                 console.log("Address==", result)
                setAddress(result);

            } catch (err) {
                if (err.message.includes('429')) {
                    setAddress('Too many requests — try again shortly');
                } else {
                    setAddress('Address not available');
                }
                console.warn('Geocoding error:', err.message);
            }
        }, 2000);


        return () => clearTimeout(debounceTimer.current);

    }, [lat, lng]);

    return address;
};

export default useReverseGeocode;