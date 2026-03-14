// ✅ Create colored vehicle marker icon based on status
export const createVehicleIcon = (ignition, speed, isSelected) => {
    const L = window.L || require('leaflet');

    const color = !ignition ? '#ef4444'   // red    — offline
        : speed === 0 ? '#f97316'   // orange — idling
            : '#22c55e';  // green  — moving

    const size = isSelected ? 44 : 36;

    return L.divIcon({
        className: '',
        html: `
            <div style="
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border: 3px solid ${isSelected ? '#ffffff' : color};
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            ">
                <div style="
                    transform: rotate(45deg);
                    text-align: center;
                    line-height: ${size}px;
                    font-size: ${isSelected ? '18px' : '14px'};
                ">🚛</div>
            </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
        popupAnchor: [0, -size],
    });
};

// ✅ Build popup HTML for a vehicle
export const createPopupContent = (vehicle) => {
    const { name, plate, driver, speed, battery, ignition } = vehicle;
    return `
        <div style="font-family: Arial; min-width: 160px;">
            <p style="margin: 0 0 6px; font-weight: bold; font-size: 14px;">🚛 ${name}</p>
            <p style="margin: 0 0 3px; font-size: 12px; color: #555;">🪪 ${plate}</p>
            <p style="margin: 0 0 3px; font-size: 12px; color: #555;">👤 ${driver}</p>
            <hr style="margin: 6px 0; border-color: #eee;"/>
            <p style="margin: 0 0 3px; font-size: 12px;">⚡ Speed: <b>${speed} km/h</b></p>
            <p style="margin: 0 0 3px; font-size: 12px;">🔋 Battery: <b>${battery}%</b></p>
            <p style="margin: 0; font-size: 12px;">🔑 Ignition: <b>${ignition ? 'ON' : 'OFF'}</b></p>
        </div>
    `;
};