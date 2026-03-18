import React from 'react';
import { Truck, Zap, ZapOff, Clock } from 'lucide-react';
import { getStatus, getLastSeen } from '../../utils/helpers';
import '../../asset/css/Infocard.css';

const STATUS_CLASS = {
    'Moving': 'info-card--moving',
    'Idling': 'info-card--idling',
    'Offline': 'info-card--offline',
};

const InfoCard = ({ vehicle, isSelected, onClick }) => {
    if (!vehicle) return null;

    const status = getStatus(vehicle.ignition, vehicle.speed);
    const time = vehicle.time || vehicle.timestamp;
    const lastSeen = getLastSeen(time);
    const statusClass = STATUS_CLASS[status.label] || '';

    return (
        <div
            className={`info-card ${statusClass} ${isSelected ? 'info-card--selected' : ''}`}
            onClick={() => onClick(vehicle)}
        >
            {/* Row 1 — Vehicle + Status Badge */}
            <div className="info-card__header">
                <div className="info-card__vehicle">
                    <div className="info-card__truck-icon">
                        <Truck size={18} strokeWidth={1.8} />
                    </div>
                    <div>
                        <p className="info-card__vehicle-name">
                            {vehicle.vehicle || vehicle.plate || '-'}
                        </p>
                        <p className="info-card__imei">
                            IMEI: {vehicle.imei ?? '-'}
                        </p>
                    </div>
                </div>

                {/* Status Badge */}
                <span
                    className="info-card__badge"
                    style={{
                        background: status.color + '18',
                        color: status.color,
                        border: `1px solid ${status.color}40`,
                    }}
                >
                    {status.label}
                </span>
            </div>

            {/* Divider */}
            <div className="info-card__divider" />

            {/* Row 2 — Speed | Ignition | Last Seen */}
            {/* <div className="info-card__stats">

                <div className="info-card__stat">
                    <p className="info-card__stat-label">SPEED</p>
                    <p className="info-card__stat-value">
                        {parseFloat(vehicle.speed) || 0}
                        <span className="info-card__stat-unit"> km/h</span>
                    </p>
                </div>

                <div className="info-card__stat-divider" />

                <div className="info-card__stat">
                    <p className="info-card__stat-label">IGNITION</p>
                    <div className="info-card__ignition">
                        {vehicle.ignition
                            ? <><Zap size={13} className="info-card__ignition-on" /><span className="info-card__ignition-on">ON</span></>
                            : <><ZapOff size={13} className="info-card__ignition-off" /><span className="info-card__ignition-off">OFF</span></>
                        }
                    </div>
                </div>

                <div className="info-card__stat-divider" />

                <div className="info-card__stat">
                    <p className="info-card__stat-label">LAST SEEN</p>
                    <div className="info-card__lastseen">
                        <Clock size={11} />
                        <p className="info-card__stat-value">{lastSeen}</p>
                    </div>
                </div>

            </div> */}
        </div>
    );
};

export default InfoCard;