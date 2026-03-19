import React, { useState } from 'react';
import SidebarHeader from './SidebarHeader';
import SummaryBadges from './SummaryBadges';
import SearchBar from './SearchBar';
import VehicleList from './VehicleList';
import { getStatus } from '../../utils/helpers';
import '../../asset/css/Sidebar.css';

const SideBar = ({ onVehicleSelect, selectedVehicle, vehicles = [], theme = 'light' }) => {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    const filteredVehicles = vehicles.filter(v => {
        const matchSearch =
            (v.vehicle ?? '').toLowerCase().includes(search.toLowerCase()) ||
            (v.imei ?? '').toLowerCase().includes(search.toLowerCase());

        const status = getStatus(v.ignition, parseFloat(v.speed)).label.toLowerCase();
        const matchFilter = filter === 'all' || status === filter;
        return matchSearch && matchFilter;
    });

    return (
        <div className="sidebar-root" data-theme={theme}>
            {/* <SidebarHeader /> */}
            <SummaryBadges filter={filter} setFilter={setFilter} vehicles={vehicles} />
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