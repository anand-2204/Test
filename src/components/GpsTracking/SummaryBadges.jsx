import React from 'react';
import VEHICLES from '../../constants/vehicleData';
import { getStatus } from '../../utils/helpers';

const SummaryBadges = ({ filter, setFilter }) => {

    const moving = VEHICLES.filter(v => getStatus(v.ignition, v.speed).label === 'Moving').length;
    const idling = VEHICLES.filter(v => getStatus(v.ignition, v.speed).label === 'Idling').length;
    const offline = VEHICLES.filter(v => getStatus(v.ignition, v.speed).label === 'Offline').length;

    const badges = [
        { label: 'Moving', count: moving, color: '#22c55e', key: 'moving' },
        { label: 'Idling', count: idling, color: '#f97316', key: 'idling' },
        { label: 'Offline', count: offline, color: '#ef4444', key: 'offline' },
    ];

    return (
        <div style={{ display: 'flex', gap: '6px', padding: '12px 16px', borderBottom: '1px solid #1e293b' }}>
            {badges.map(item => (
                <div
                    key={item.key}
                    onClick={() => setFilter(filter === item.key ? 'all' : item.key)}
                    style={{
                        flex: 1,
                        textAlign: 'center',
                        padding: '6px 4px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        background: filter === item.key ? item.color + '33' : '#1e293b',
                        border: `1px solid ${filter === item.key ? item.color : '#334155'}`,
                        transition: 'all 0.2s'
                    }}
                >
                    <p style={{ margin: 0, color: item.color, fontSize: '16px', fontWeight: 'bold' }}>
                        {item.count}
                    </p>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '10px' }}>
                        {item.label}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default SummaryBadges;