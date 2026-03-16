import React from 'react';
import InfoCard from './InfoCards';


const VehicleList = ({ vehicles = [], selectedVehicle, onVehicleSelect }) => {
    return (
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
            {vehicles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#475569' }}>
                    <p style={{ fontSize: '32px', margin: 0 }}>🔍</p>
                    <p style={{ margin: '8px 0 0', fontSize: '14px' }}>No vehicles found</p>
                </div>
            ) : (
                vehicles.map(vehicle => (
                
                    vehicle && (
                        <InfoCard
                            key={vehicle.imei}
                            vehicle={vehicle}         
                            isSelected={selectedVehicle?.imei === vehicle.imei}
                            onClick={onVehicleSelect}
                        />
                    )
                ))
            )}
        </div>
    );
};

export default VehicleList;