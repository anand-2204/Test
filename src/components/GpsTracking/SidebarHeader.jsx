import React from 'react';
import VEHICLES from '../../constants/vehicleData';

const SidebarHeader = () => {
    return (
        <div style={{ padding: '16px', borderBottom: '1px solid #1e293b' }}>
            <h2 style={{ margin: '0 0 4px 0', color: '#f1f5f9', fontSize: '18px' }}>
                🚛 Fleet Tracker
            </h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '12px' }}>
                {VEHICLES.length} Total Vehicles
            </p>
        </div>
    );
};

export default SidebarHeader;