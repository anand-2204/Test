import React, { useState, useEffect } from 'react';
import Sidebar from '../components/GpsTracking/Sidebar';
import MapView from '../components/map/MapView';
import StatusBar from '../components/GpsTracking/StatusBar';
import useVehicleData from '../hooks/useVehicleData';
import useReverseGeocode from '../hooks/useReverseGeocode';
import '../asset/css/GpsRecord.css';
import { fetchGpsData } from '../globalContext/redux/Slice/GpsDataSlice';
import { useDispatch, useSelector } from 'react-redux';




import {
  Satellite,
  PanelLeftClose,
  PanelLeftOpen,
  Truck,
  X,
  Radio,
  MapPin,
  Cpu,
  Navigation,
  Clock,
  WifiOff,
} from 'lucide-react';

const GpsRecords = () => {
  const { vehicleData, selectVehicle } = useVehicleData();
  const address = useReverseGeocode(vehicleData?.lat, vehicleData?.lng);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const dispatch = useDispatch();
  const { gpsData, loading, error, history } = useSelector((state) => state.gpsData)


  useEffect(() => {
    dispatch(fetchGpsData());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    selectVehicle(vehicle);
  };

  const movingCount = gpsData.filter(v => v.ignition && v.speed > 0).length;
  const idlingCount = gpsData.filter(v => v.ignition && v.speed === 0).length;
  const offlineCount = gpsData.filter(v => !v.ignition).length;

  return (
    <>
      <div className="gps-root">

        {/* ── Navbar ── */}
        <nav className="gps-navbar">
          <div className="gps-navbar-left">

            <button
              className="gps-toggle-btn"
              onClick={() => setIsSidebarOpen(p => !p)}
              title={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {isSidebarOpen ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}
            </button>

            <div className="gps-logo">
              <div className="gps-logo-icon">
                <Satellite size={18} strokeWidth={1.8} />
              </div>
              <div>
                <p className="gps-logo-title">FleetTrack</p>
                <p className="gps-logo-subtitle">Live Vehicle Monitoring</p>
              </div>
            </div>

          </div>



          <div className="gps-navbar-right">
            <div className="gps-live-badge">
              <span className="gps-live-dot" />
              <Radio size={11} strokeWidth={2.5} />
              <span>LIVE</span>
            </div>

            <div className="gps-clock-block">
              <span className="gps-clock">{currentTime.toLocaleTimeString()}</span>
              <span className="gps-date">{currentTime.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        </nav>

        {/* ── Body ── */}
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
              vehicles={gpsData}
            />
          </div>

          {/* Right Panel */}
          <div className="gps-right">

            {/* Info Panel */}
            <div className="gps-info-panel">
              {selectedVehicle ? (
                <div className="gps-vehicle-header">
                  <div className="gps-vehicle-icon">
                    <Truck size={19} strokeWidth={1.8} />
                  </div>
                  <div className="gps-vehicle-meta">
                    <p className="gps-vehicle-name">
                      {selectedVehicle.vehicle || selectedVehicle.plate}
                    </p>
                    <p className="gps-vehicle-sub">
                      <Cpu size={10} />
                      <span>{selectedVehicle.imei}</span>
                      <span className="gps-meta-dot">•</span>
                      <MapPin size={10} />
                      <span>{selectedVehicle.city || '—'}</span>
                    </p>
                  </div>

                  <div className="gps-statusbar-wrap">
                    <StatusBar address={address} />
                  </div>

                  <button
                    className="gps-deselect-btn"
                    onClick={() => setSelectedVehicle(null)}
                  >
                    <X size={13} />
                    Deselect
                  </button>
                </div>
              ) : (
                <div className="gps-placeholder">
                  <Truck size={18} strokeWidth={1.6} />
                  <span>Select a vehicle from the sidebar to view details</span>
                </div>
              )}
            </div>

            {/* Map */}
            <div className="gps-map-wrapper">
              <MapView
                vehicles={gpsData}
                selectedVehicle={selectedVehicle}
                onVehicleSelect={handleVehicleSelect}
              />

              <div className="gps-map-label">
                <MapPin size={12} />
                <span>{gpsData.length} Vehicles</span>
                <span className="gps-map-sep">•</span>
                <span className="gps-map-live">Live</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </>
  );
};

export default GpsRecords;