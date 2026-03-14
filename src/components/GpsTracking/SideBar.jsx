import React, { useState } from 'react';
import SidebarHeader from './SidebarHeader';
import SummaryBadges from './SummaryBadges';
import SearchBar from './SearchBar';
import VehicleList from './VehicleList';
import VEHICLES from '../../constants/vehicleData';
import { getStatus } from '../../utils/helpers';

const SideBar = ({ onVehicleSelect, selectedVehicle }) => {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    // Apply search + filter
    const filteredVehicles = VEHICLES.filter(v => {
        const matchSearch =
            v.name.toLowerCase().includes(search.toLowerCase()) ||
            v.plate.toLowerCase().includes(search.toLowerCase()) ||
            v.driver.toLowerCase().includes(search.toLowerCase());

        const status = getStatus(v.ignition, v.speed).label.toLowerCase();
        const matchFilter = filter === 'all' || status === filter;

        return matchSearch && matchFilter;
    });

    return (
        <div style={{
            width: '300px',
            minWidth: '300px',
            height: '100vh',
            background: '#0f172a',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRight: '1px solid #1e293b'
        }}>
            {/* <SidebarHeader /> */}
            <SummaryBadges filter={filter} setFilter={setFilter} />
            <SearchBar search={search} setSearch={setSearch} />
            <VehicleList
                vehicles={filteredVehicles}
                selectedVehicle={selectedVehicle}
                onVehicleSelect={onVehicleSelect}
            />
        </div>
    );
};

export default SideBar;