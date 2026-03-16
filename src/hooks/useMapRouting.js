import { useEffect } from 'react';
import L from 'leaflet';

const useMapRouting = (mapRef, markersRef, destMarkerRef, routingControlRef, selectedVehicle) => {
    useEffect(() => {
        if (!mapRef.current) return;

        const map = mapRef.current;

        const handleClick = (e) => {
            if (!selectedVehicle) return; // only route if vehicle selected

            const destLatLng = [e.latlng.lat, e.latlng.lng];
            const { lat, lng, imei } = selectedVehicle;

            // ✅ Update or create destination marker
            if (destMarkerRef.current) {
                destMarkerRef.current.setLatLng(destLatLng);
            } else {
                destMarkerRef.current = L.marker(destLatLng).addTo(map);
            }

            // ✅ Remove old route
            if (routingControlRef.current) {
                map.removeControl(routingControlRef.current);
            }

            // ✅ Draw new route
            routingControlRef.current = L.Routing.control({
                waypoints: [
                    L.latLng(lat, lng),
                    L.latLng(destLatLng[0], destLatLng[1])
                ],
                routeWhileDragging: false,
                show: true,
                addWaypoints: false,
            })
                .on('routesfound', (e) => {
                    const route = e.routes[0].coordinates;
                    route.forEach((coord, index) => {
                        setTimeout(() => {
                            if (markersRef.current[imei]) {
                                markersRef.current[imei]
                                    .setLatLng([coord.lat, coord.lng]);
                            }
                        }, 50 * index);
                    });
                })
                .addTo(map);
        };

        map.on('click', handleClick);

        // ✅ Cleanup — remove old listener before adding new one
        return () => map.off('click', handleClick);

    }, [selectedVehicle]);
};

export default useMapRouting;