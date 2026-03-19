import React from 'react';
import { getStatus } from '../../utils/helpers';

const parseCoords = (location = '') => {
    const parts = location.trim().split(/\s+/);
    if (parts.length < 2) return { lat: '--', lng: '--' };
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    return {
        lat: isNaN(lat) ? '--' : lat.toFixed(4),
        lng: isNaN(lng) ? '--' : lng.toFixed(4),
    };
};

const VehicleCard = ({ vehicle, selected, onClick }) => {
    const statusObj = getStatus(vehicle.ignition, parseFloat(vehicle.speed));
    const statusKey = statusObj.label.toLowerCase(); // 'moving' | 'idle' | 'stopped'
    const coords = parseCoords(vehicle.location);

    return (
        <div
            className={`sb-vcard sb-vcard--${statusKey} ${selected ? 'sb-vcard--selected' : ''}`}
            onClick={onClick}
        >
            {/* Row 1: vehicle ID + status badge */}
            <div className="sb-vcard__row1">
                <span className="sb-vcard__id">
                    {vehicle.vehicle || vehicle.imei}
                </span>
                <span className="sb-vcard__status">
                    <span className={`sb-vcard__dot sb-vcard__dot--${statusKey}`} />
                    <span className={`sb-vcard__status-text sb-vcard__status-text--${statusKey}`}>
                        {statusObj.label}
                    </span>
                </span>
            </div>

            {/* IMEI */}
            <div className="sb-vcard__imei">{vehicle.imei}</div>

            {/* Row 2: coordinates + speed */}
            <div className="sb-vcard__row2">
                <span className="sb-vcard__loc">
                    📍 {coords.lat}°, {coords.lng}°
                </span>
                <span className="sb-vcard__spd">{vehicle.speed ?? 0} km/h</span>
            </div>

            {/* Timestamp */}
            {vehicle.time && (
                <div className="sb-vcard__time">{vehicle.time}</div>
            )}
        </div>
    );
};

const VehicleList = ({ vehicles = [], selectedVehicle, onVehicleSelect }) => {
    if (vehicles.length === 0) {
        return (
            <div className="sb-list">
                <div className="sb-list__empty">
                    <span className="sb-list__empty-icon">🚛</span>
                    <span>No vehicles match your search or filter.</span>
                </div>
            </div>
        );
    }

    return (
        <div className="sb-list">
            <div className="sb-list__count">
                {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}
            </div>
            {vehicles.map((v, i) => (
                <VehicleCard
                    key={v.imei ?? i}
                    vehicle={v}
                    selected={selectedVehicle?.imei === v.imei}
                    onClick={() => onVehicleSelect?.(v)}
                />
            ))}
        </div>
    );
};

export default VehicleList;