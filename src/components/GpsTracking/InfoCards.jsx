import React from 'react';
import { getStatus, getLastSeen, getBatteryColor } from '../../utils/helpers';

const InfoCard = ({ vehicle, isSelected, onClick }) => {

    // ✅ Safety guard — if vehicle is undefined, render nothing
    if (!vehicle) return null;

    const status = getStatus(vehicle.ignition, vehicle.speed);
    const lastSeen = getLastSeen(vehicle.timestamp);

    return (
        <div
            onClick={() => onClick(vehicle)}
            style={{
                padding: '12px',
                marginBottom: '8px',
                borderRadius: '10px',
                cursor: 'pointer',
                background: isSelected ? '#1e40af' : '#1e293b',
                border: isSelected ? '1px solid #3b82f6' : '1px solid #334155',
                transition: 'all 0.2s ease',
            }}
        >
            {/* Row 1 — Name + Status Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '22px' }}>🚛</span>
                    <div>
                        <p style={{ margin: 0, color: '#f1f5f9', fontWeight: 'bold', fontSize: '14px' }}>
                            {vehicle.name ?? '-'}
                        </p>
                        <p style={{ margin: 0, color: '#94a3b8', fontSize: '11px' }}>
                            {vehicle.plate ?? '-'}
                        </p>
                    </div>
                </div>

                {/* Status Badge */}
                <span style={{
                    background: status.color + '22',
                    color: status.color,
                    border: `1px solid ${status.color}`,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 'bold'
                }}>
                    {status.dot} {status.label}
                </span>
            </div>

            {/* Row 2 — Speed + Battery + Last Seen + Driver */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '10px' }}>SPEED</p>
                    <p style={{ margin: 0, color: '#f1f5f9', fontSize: '13px', fontWeight: 'bold' }}>
                        {vehicle.speed ?? 0}
                        <span style={{ fontSize: '10px' }}>km/h</span>
                    </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '10px' }}>BATTERY</p>
                    <p style={{ margin: 0, color: getBatteryColor(vehicle.battery), fontSize: '13px', fontWeight: 'bold' }}>
                        {vehicle.battery ?? 0}%
                    </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '10px' }}>LAST SEEN</p>
                    <p style={{ margin: 0, color: '#f1f5f9', fontSize: '13px', fontWeight: 'bold' }}>
                        {lastSeen}
                    </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '10px' }}>DRIVER</p>
                    <p style={{ margin: 0, color: '#f1f5f9', fontSize: '11px', fontWeight: 'bold' }}>
                        {/* ✅ optional chaining — won't crash if driver is undefined */}
                        {vehicle.driver?.split(' ')[0] ?? '-'}
                    </p>
                </div>

            </div>

            {/* Battery Bar */}
            <div style={{ marginTop: '8px', background: '#334155', borderRadius: 4, height: 4 }}>
                <div style={{
                    width: `${vehicle.battery ?? 0}%`,
                    background: getBatteryColor(vehicle.battery),
                    height: 4,
                    borderRadius: 4,
                    transition: 'width 0.3s ease'
                }} />
            </div>
        </div>
    );
};

export default InfoCard;