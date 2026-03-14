import React from 'react';

const StatusBar = ({ address }) => {
    return (
        <div style={{
            background: '#fff',
            borderRadius: 8,
            padding: '10px 16px',
            marginBottom: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
            <span style={{ color: '#64748b', fontSize: '13px' }}>📍 Current Location: </span>
            <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: '500' }}>{address}</span>
        </div>
    );
};

export default StatusBar;