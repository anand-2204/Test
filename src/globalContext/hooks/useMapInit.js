import { useEffect } from 'react';
import L from 'leaflet';

const DEFAULT_CENTER = [28.2380, 83.9956];

const useMapInit = (mapContainerRef, mapRef) => {
    useEffect(() => {
        if (mapRef.current) return;
        if (!mapContainerRef.current) return;

        // ✅ Initialize Leaflet map
        const map = L.map(mapContainerRef.current, {
            center: DEFAULT_CENTER,
            zoom: 12,
            zoomControl: true,
        });

        mapRef.current = map;

        // ✅ Tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19,
        }).addTo(map);

        // ✅ Fix blank/grey map issue
        setTimeout(() => map.invalidateSize(), 100);

        // ✅ Cleanup on unmount
        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);
};

export default useMapInit;