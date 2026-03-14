import React, { useState, useEffect } from 'react';
import Sidebar from '../components/GpsTracking/Sidebar';
import MapView from '../components/map/MapView';
import InfoCards from '../components/GpsTracking/InfoCards';
import StatusBar from '../components/GpsTracking/StatusBar';
import useVehicleData from '../globalContext/hooks/useVehicleData';
import useReverseGeocode from '../globalContext/hooks/useReverseGeocode';
import VEHICLES from '../constants/vehicleData';
import { useTheme } from '../globalContext/context/ThemeContect';
import '../asset/css/GpsRecord.css';
import StatsPanel from '../components/GpsTracking/StatsPanel';



const SunIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42
             M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
);

const MoonIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
);

const GpsRecords = () => {
    const { vehicleData, lastSeen, updateFromSocket } = useVehicleData();
    const address = useReverseGeocode(vehicleData?.lat, vehicleData?.lng);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const { isDark, toggleTheme } = useTheme();
    const [isStatsOpen, setIsStatsOpen] = useState(true);

    // ✅ Live clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleVehicleSelect = (vehicle) => {
        setSelectedVehicle(vehicle);
        updateFromSocket(vehicle);
    };

    const movingCount = VEHICLES.filter(v => v.ignition && v.speed > 0).length;
    const idlingCount = VEHICLES.filter(v => v.ignition && v.speed === 0).length;
    const offlineCount = VEHICLES.filter(v => !v.ignition).length;

    return (
        <>


            {/* ── Root ─────────────────────────────────────────── */}
            <div className="gps-root">

                {/* ── Navbar ───────────────────────────────────── */}
                <nav className="gps-navbar">

                    {/* Left */}
                    <div className="gps-navbar-left">
                        <button
                            className="gps-toggle-btn"
                            onClick={() => setIsSidebarOpen(p => !p)}
                            title={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                        >
                            {isSidebarOpen ? '◀' : '▶'}
                        </button>

                        <div className="gps-logo">
                            <span className="gps-logo-icon">🛰️</span>
                            <div>
                                <p className="gps-logo-title">FleetTrack</p>
                                <p className="gps-logo-subtitle">LIVE VEHICLE MONITORING</p>
                            </div>
                        </div>
                    </div>



                    {/* Right */}
                    <div className="gps-navbar-right">
                        <div className="gps-live-badge">
                            <span className="gps-live-dot" />
                            <span className="gps-live-text">LIVE</span>
                        </div>
                        <span className="gps-clock">
                            {currentTime.toLocaleTimeString()}
                        </span>
                    </div>

                    {/* Dark mode toggle */}
                    <button className="btn-theme-toggle" onClick={toggleTheme} title="Toggle dark mode">
                        {isDark ? <SunIcon /> : <MoonIcon />}
                        {isDark ? 'Light' : 'Dark'}
                    </button>
                </nav>

                {/* ── Body ─────────────────────────────────────── */}
                <div className="gps-body">

                    {/* Sidebar */}
                    <div
                        className="gps-sidebar-wrapper"
                        style={{
                            width: isSidebarOpen ? '300px' : '0px',
                            minWidth: isSidebarOpen ? '300px' : '0px',
                        }}
                    >
                        <Sidebar
                            onVehicleSelect={handleVehicleSelect}
                            selectedVehicle={selectedVehicle}
                        />
                    </div>

                    {/* Right Panel */}
                    <div className="gps-right">

                        {/* Info Panel */}
                        <div className="gps-info-panel">
                            {selectedVehicle ? (
                                <>
                                    {/* Vehicle Header */}
                                    <div className="gps-vehicle-header">
                                        <div className="gps-vehicle-icon">🚛</div>
                                        <div>
                                            <p className="gps-vehicle-name">
                                                {selectedVehicle.name}
                                            </p>
                                            <p className="gps-vehicle-sub">
                                                {selectedVehicle.plate} &nbsp;•&nbsp; {selectedVehicle.driver}
                                            </p>
                                        </div>
                                        <button
                                            className="gps-deselect-btn"
                                            onClick={() => setSelectedVehicle(null)}
                                        >
                                            ✕ Deselect
                                        </button>
                                    </div>

                                    <InfoCards vehicleData={vehicleData} lastSeen={lastSeen} />
                                    <StatusBar address={address} />
                                </>
                            ) : (
                                <div className="gps-placeholder">
                                    <div className="gps-placeholder-icon">🚛</div>
                                    <span>Select a vehicle from the sidebar to view live details</span>
                                </div>
                            )}
                        </div>

                        {/* Map */}
                        <div className="gps-map-wrapper">
                            <div className="gps-map-inner">
                                <MapView
                                    vehicles={VEHICLES}
                                    selectedVehicle={selectedVehicle}
                                    onVehicleSelect={handleVehicleSelect}
                                />
                            </div>
                            {/* Map overlay label */}
                            <div className="gps-map-label">
                                🗺️ {VEHICLES.length} Vehicles • Live
                            </div>
                        </div>

                    </div>


                </div>

            </div>
            {/* ✅ Stats Panel sits below the map */}
            <StatsPanel
                selectedVehicle={selectedVehicle}
                isOpen={isStatsOpen}
                onToggle={() => setIsStatsOpen(p => !p)}
            />
        </>
    );
};

export default GpsRecords;