import React from 'react';
import { Navigation, Clock, WifiOff } from 'lucide-react';
import VEHICLES from '../../constants/vehicleData';
import { getStatus } from '../../utils/helpers';
import '../../asset/css/SummaryBadges.css';

const SummaryBadges = ({ filter, setFilter }) => {

    const moving = VEHICLES.filter(v => getStatus(v.ignition, v.speed).label === 'Moving').length;
    const idling = VEHICLES.filter(v => getStatus(v.ignition, v.speed).label === 'Idling').length;
    const offline = VEHICLES.filter(v => getStatus(v.ignition, v.speed).label === 'Offline').length;

    const badges = [
        {
            label: 'Moving',
            count: moving,
            key: 'moving',
            icon: <Navigation size={13} strokeWidth={2} />,
            className: 'badge--moving',
        },
        {
            label: 'Idling',
            count: idling,
            key: 'idling',
            icon: <Clock size={13} strokeWidth={2} />,
            className: 'badge--idling',
        },
        {
            label: 'Offline',
            count: offline,
            key: 'offline',
            icon: <WifiOff size={13} strokeWidth={2} />,
            className: 'badge--offline',
        },
    ];

    return (
        <div className="summary-badges">
            {badges.map(item => (
                <div
                    key={item.key}
                    onClick={() => setFilter(filter === item.key ? 'all' : item.key)}
                    className={`summary-badge ${item.className} ${filter === item.key ? 'summary-badge--active' : ''}`}
                >
                    <div className="summary-badge__icon">
                        {item.icon}
                    </div>
                    <div className="summary-badge__content">
                        <p className="summary-badge__count">{item.count}</p>
                        <p className="summary-badge__label">{item.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SummaryBadges;