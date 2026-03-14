// Vehicle status based on ignition + speed
export const getStatus = (ignition, speed) => {
    if (!ignition) return { label: 'Offline', color: '#ef4444', dot: '🔴' };
    if (ignition && speed === 0) return { label: 'Idling', color: '#f97316', dot: '🟡' };
    return { label: 'Moving', color: '#22c55e', dot: '🟢' };
};

// Last seen time
export const getLastSeen = (timestamp) => {
    const diff = Math.floor((Date.now() - new Date(timestamp)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
};

// Battery color
export const getBatteryColor = (battery) => {
    if (battery > 50) return '#22c55e';
    if (battery > 20) return '#f97316';
    return '#ef4444';
};