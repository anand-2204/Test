// ✅ Create colored vehicle marker icon based on status
export const createVehicleIcon = (ignition, speed, isSelected) => {
    const L = window.L || require('leaflet');

    const color = !ignition ? '#ef4444'
        : speed === 0 ? '#f97316'
            : '#22c55e';

    const bgLight = !ignition ? '#fff5f5'
        : speed === 0 ? '#fff7ed'
            : '#f0fdf4';

    const size = isSelected ? 48 : 38;
    const iconSize = isSelected ? 22 : 17;

    // Lucide "Truck" SVG path (inline)
    const truckSVG = `
        <svg xmlns="http://www.w3.org/2000/svg"
            width="${iconSize}" height="${iconSize}"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            style="display:block;"
        >
            <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/>
            <rect x="9" y="11" width="14" height="10" rx="2"/>
            <circle cx="12" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
        </svg>
    `;

    const pulseRing = isSelected ? `
        <div style="
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: ${size + 16}px;
            height: ${size + 16}px;
            border-radius: 50%;
            border: 2.5px solid ${color};
            opacity: 0.35;
            pointer-events: none;
        "></div>
    ` : '';

    return L.divIcon({
        className: '',
        html: `
            <div style="position: relative; width: ${size + 16}px; height: ${size + 16}px;">
                ${pulseRing}
                <div style="
                    position: absolute;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    width: ${size}px;
                    height: ${size}px;
                    background: ${color};
                    border: 3px solid #ffffff;
                    border-radius: 50% 50% 50% 0;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    box-shadow: 0 3px 10px rgba(0,0,0,0.25);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">
                        ${truckSVG}
                    </div>
                </div>
            </div>
        `,
        iconSize: [size + 16, size + 16],
        iconAnchor: [(size + 16) / 2, size + 16],
        popupAnchor: [0, -(size + 16)],
    });
};

// ✅ Build popup HTML using actual API fields
export const createPopupContent = (vehicle) => {
    const {
        vehicle: plateNumber,
        imei,
        ignition,
        speed,
        city,
        time,
    } = vehicle;

    const statusColor = !ignition ? '#ef4444' : speed === 0 ? '#f97316' : '#22c55e';
    const statusLabel = !ignition ? 'Offline' : speed === 0 ? 'Idling' : 'Moving';
    const statusBg = !ignition ? '#fff5f5' : speed === 0 ? '#fff7ed' : '#f0fdf4';

    const formattedTime = time
        ? new Date(time).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        })
        : '—';

    // Inline Lucide SVG icons for popup
    const truckIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect x="9" y="11" width="14" height="10" rx="2"/><circle cx="12" cy="21" r="1"/><circle cx="20" cy="21" r="1"/></svg>`;

    const zapIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${ignition ? '#16a34a' : '#ef4444'}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;

    const zapOffIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="12.41 6.75 13 2 10.57 4.92"/><polyline points="18.57 12.91 21 10 15.66 10"/><polyline points="8 8 3 14 12 14 11 22 16 16"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

    const clockIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#b0b7c3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;

    const cpuIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#b0b7c3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>`;

    return `
        <div style="font-family: 'DM Sans', sans-serif; min-width: 210px; padding: 4px 2px;">

            <!-- Header -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="
                        width: 34px; height: 34px;
                        background: ${statusBg};
                        border-radius: 9px;
                        display: flex; align-items: center; justify-content: center;
                        color: ${statusColor};
                    ">${truckIcon}</div>
                    <div>
                        <p style="margin: 0; font-weight: 700; font-size: 13px; color: #1a1d23; letter-spacing: -0.1px;">
                            ${plateNumber || '—'}
                        </p>
                        <p style="margin: 1px 0 0; font-size: 10px; color: #9ea5b5;">
                            ${city || '—'}
                        </p>
                    </div>
                </div>
                <span style="
                    background: ${statusBg};
                    color: ${statusColor};
                    border: 1px solid ${statusColor}40;
                    padding: 3px 9px;
                    border-radius: 20px;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.4px;
                    text-transform: uppercase;
                ">${statusLabel}</span>
            </div>

            <!-- Divider -->
            <div style="height: 1px; background: #f4f4f4; margin-bottom: 10px;"></div>

            <!-- Stats Row -->
            <div style="display: flex; justify-content: space-between; text-align: center; margin-bottom: 10px;">
                <div style="flex: 1;">
                    <p style="margin: 0 0 3px; font-size: 9px; color: #c0c5cf; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase;">Speed</p>
                    <p style="margin: 0; font-size: 13px; font-weight: 700; color: #1a1d23;">
                        ${parseFloat(speed) || 0}<span style="font-size: 10px; color: #b0b7c3;"> km/h</span>
                    </p>
                </div>
                <div style="width: 1px; background: #f0f0f0; flex-shrink: 0;"></div>
                <div style="flex: 1;">
                    <p style="margin: 0 0 3px; font-size: 9px; color: #c0c5cf; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase;">Ignition</p>
                    <div style="display: flex; align-items: center; justify-content: center; gap: 4px;">
                        ${ignition ? zapIcon : zapOffIcon}
                        <span style="font-size: 12px; font-weight: 700; color: ${ignition ? '#16a34a' : '#ef4444'};">
                            ${ignition ? 'ON' : 'OFF'}
                        </span>
                    </div>
                </div>
                <div style="width: 1px; background: #f0f0f0; flex-shrink: 0;"></div>
                <div style="flex: 1;">
                    <p style="margin: 0 0 3px; font-size: 9px; color: #c0c5cf; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase;">Updated</p>
                    <div style="display: flex; align-items: center; justify-content: center; gap: 3px;">
                        ${clockIcon}
                        <span style="font-size: 11px; font-weight: 600; color: #4b5260;">${formattedTime}</span>
                    </div>
                </div>
            </div>

            <!-- IMEI Footer -->
            <div style="
                background: #f8f9fb;
                border-radius: 8px;
                padding: 7px 10px;
                display: flex;
                align-items: center;
                gap: 6px;
            ">
                ${cpuIcon}
                <span style="font-size: 10px; color: #b0b7c3; font-weight: 600; letter-spacing: 0.3px;">IMEI</span>
                <span style="font-size: 11px; color: #6b7280; font-weight: 600; font-family: monospace; letter-spacing: 0.2px;">
                    ${imei || '—'}
                </span>
            </div>
        </div>
    `;
};