import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const useMapRouting = (
    mapRef,
    markersRef,
    destMarkerRef,
    routingControlRef,
    selectedVehicle
) => {
    useEffect(() => {
        if (!mapRef.current) return;

        const map = mapRef.current;

        const handleClick = (e) => {
            if (!selectedVehicle) return;

            const destLatLng = [e.latlng.lat, e.latlng.lng];

            const [lat, lng] = selectedVehicle.location.split(" ").map(Number);

            const { imei } = selectedVehicle;

            // destination marker
            if (destMarkerRef.current) {
                destMarkerRef.current.setLatLng(destLatLng);
            } else {
                destMarkerRef.current = L.marker(destLatLng).addTo(map);
            }

            // remove previous route
            if (routingControlRef.current) {
                map.removeControl(routingControlRef.current);
            }

            // create route
            routingControlRef.current = L.Routing.control({
                waypoints: [
                    L.latLng(lat, lng),
                    L.latLng(destLatLng[0], destLatLng[1]),
                ],
                routeWhileDragging: false,
                show: true,
                addWaypoints: false,
            })
                .on("routesfound", (e) => {
                    const route = e.routes[0].coordinates;

                    route.forEach((coord, index) => {
                        setTimeout(() => {
                            if (markersRef.current[imei]) {
                                markersRef.current[imei].setLatLng([
                                    coord.lat,
                                    coord.lng,
                                ]);
                            }
                        }, 50 * index);
                    });
                })
                .addTo(map);
        };

        // map.on("click", handleClick);

        return () => map.off("click", handleClick);
    }, [selectedVehicle, mapRef, markersRef, destMarkerRef, routingControlRef]);
};

export default useMapRouting;
