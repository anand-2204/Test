import React from 'react';

// ✅ Just the styled wrapper div — no logic
const MapContainer = ({ mapContainerRef }) => {
    return (
        <div style={{
            height: '520px',
            width: '100%',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            position: 'relative',
        }}>
            <div
                ref={mapContainerRef}
                style={{
                    height: '100%',
                    width: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                }}
            />
        </div>
    );
};

export default MapContainer;