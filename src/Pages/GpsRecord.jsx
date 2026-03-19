import React, { useState, useEffect } from 'react';
import Sidebar from '../components/GpsTracking/Sidebar';
import MapView from '../components/map/MapView';
import StatusBar from '../components/GpsTracking/StatusBar';
import useVehicleData from '../hooks/useVehicleData';
import useReverseGeocode from '../hooks/useReverseGeocode';
import '../asset/css/GpsRecord.css';
import { fetchGpsData } from '../globalContext/redux/Slice/GpsDataSlice';
import { useDispatch, useSelector } from 'react-redux';
import Analytics from '../components/AnalyticsPanel/Analytics';

import {
  Satellite,
  PanelLeftClose,
  PanelLeftOpen,
  Truck,
  X,
  Radio,
  MapPin,
  Cpu,
  Map,
  BarChart2,
  Sun,
  Moon,
} from 'lucide-react';

/* ─── Auto-detect mobile ───────────────────────────────────────── */
const isMobileWidth = () => window.innerWidth <= 640;

/* ─── Poll interval ────────────────────────────────────────────── */
const POLL_MS = 15_000;

const GpsRecords = () => {
  const { vehicleData, selectVehicle } = useVehicleData();
  const address = useReverseGeocode(vehicleData?.lat, vehicleData?.lng);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [theme, setTheme] = useState('light');
  const [activeView, setActiveView] = useState('map');   // 'map' | 'analytics'
  const [isMobile, setIsMobile] = useState(isMobileWidth);

  const dispatch = useDispatch();
  const { gpsData, loading } = useSelector((state) => state.gpsData);

  /* ── Fetch + poll + clock ── */
  useEffect(() => {
    dispatch(fetchGpsData());
    const poll = setInterval(() => dispatch(fetchGpsData()), POLL_MS);
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => { clearInterval(poll); clearInterval(clock); };
  }, [dispatch]);

  /* ── Track viewport width for mobile layout ── */
  useEffect(() => {
    const onResize = () => setIsMobile(isMobileWidth());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    selectVehicle(vehicle);
  };

  /* ── Fleet counts ── */
  const movingCount = gpsData.filter(v => v.ignition && v.speed > 0).length;
  const idlingCount = gpsData.filter(v => v.ignition && v.speed === 0).length;
  const offlineCount = gpsData.filter(v => !v.ignition).length;

  /* ── On mobile: toggle sidebar shows/hides the bottom list panel ── */
  const sidebarVisible = isMobile ? isSidebarOpen : isSidebarOpen;

  /* ── Sidebar inline style — desktop width / mobile handled by CSS ── */
  const sidebarStyle = isMobile
    ? {} // CSS media query handles all mobile sizing
    : {
      width: isSidebarOpen ? '300px' : '0px',
      minWidth: isSidebarOpen ? '300px' : '0px',
    };

  /* ── Loading screen ── */
  if (loading && gpsData.length === 0) {
    return (
      <div className="gps-root" data-theme={theme}>
        <div className="gps-loading">
          <div className="gps-loading__spinner" />
          <div className="gps-loading__text">INITIALISING GPS…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="gps-root" data-theme={theme}>

      {/* ══════════════════════════════════════════
                NAVBAR
            ══════════════════════════════════════════ */}
      <nav className="gps-navbar">

        {/* Left: toggle + logo */}
        <div className="gps-navbar-left">
          <button
            className="gps-toggle-btn"
            onClick={() => setIsSidebarOpen(p => !p)}
            title={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          >
            {isSidebarOpen
              ? <PanelLeftClose size={16} />
              : <PanelLeftOpen size={16} />}
          </button>

          <div className="gps-logo">
            <div className="gps-logo-icon">
              <Satellite size={17} strokeWidth={1.8} />
            </div>
            <div>
              <div className="an-header__eyebrow">Fleet Command</div>
              <h1 className="an-header__title">
                VEHICLE <span>TRACKER</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Right: counters + live + theme + clock */}
        <div className="gps-navbar-right">

          {/* Fleet counters — hidden on mobile via CSS */}
          <div className="gps-fleet-counters">
            <div className="gps-counter">
              <span className="gps-counter__dot"
                style={{ background: 'var(--green)', boxShadow: '0 0 5px var(--green)' }} />
              {movingCount}
            </div>
            <div className="gps-counter">
              <span className="gps-counter__dot" style={{ background: 'var(--yellow)' }} />
              {idlingCount}
            </div>
            <div className="gps-counter">
              <span className="gps-counter__dot" style={{ background: 'var(--red)' }} />
              {offlineCount}
            </div>
          </div>

          {/* Live badge */}
          <div className="gps-live-badge">
            <span className="gps-live-dot" />
            <Radio size={10} strokeWidth={2.5} />
            <span>LIVE</span>
          </div>

          {/* Theme toggle */}
          <button
            className="gps-theme-btn"
            onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
            title="Toggle theme"
          >
            <span className="gps-theme-btn__icon">
              {theme === 'light' ? '🌙' : '☀️'}
            </span>
            <span>{theme === 'light' ? 'DARK' : 'LIGHT'}</span>
          </button>

          {/* Clock — hidden on mobile via CSS */}
          <div className="gps-clock-block">
            <span className="gps-clock">
              {currentTime.toLocaleTimeString()}
            </span>
            <span className="gps-date">
              {currentTime.toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric'
              })}
            </span>
          </div>
        </div>
      </nav>


      <div className="gps-body">


        <div
          className={`gps-sidebar-wrapper${isMobile && !isSidebarOpen ? ' gps-sidebar-wrapper--hidden' : ''}`}
          style={sidebarStyle}
        >
          <Sidebar
            onVehicleSelect={handleVehicleSelect}
            selectedVehicle={selectedVehicle}
            vehicles={gpsData}
            theme={theme}
          />
        </div>

        {/* ── Right panel ── */}
        <div className="gps-right">

          {/* Info strip */}
          <div className="gps-info-panel">
            {selectedVehicle ? (
              <div className="gps-vehicle-header">
                <div className="gps-vehicle-icon">
                  <Truck size={17} strokeWidth={1.8} />
                </div>
                <div className="gps-vehicle-meta">
                  <p className="gps-vehicle-name">
                    {selectedVehicle.vehicle || selectedVehicle.imei}
                  </p>
                  <p className="gps-vehicle-sub">
                    <Cpu size={9} />
                    <span>{selectedVehicle.imei}</span>
                    <span className="gps-meta-dot">•</span>
                    <MapPin size={9} />
                    <span>{selectedVehicle.city || address || '—'}</span>
                  </p>
                </div>
                <div className="gps-statusbar-wrap">
                  <StatusBar address={address} />
                </div>
                <button
                  className="gps-deselect-btn"
                  onClick={() => { setSelectedVehicle(null); selectVehicle(null); }}
                >
                  <X size={11} />
                  Deselect
                </button>
              </div>
            ) : (
              <div className="gps-placeholder">
                <Truck size={15} strokeWidth={1.6} />
                <span>
                  {isMobile
                    ? 'Select a vehicle below'
                    : 'Select a vehicle from the sidebar to view details'}
                </span>
              </div>
            )}
          </div>

          {/* Map + Analytics */}
          <div className="gps-map-wrapper">


            <MapView
              vehicles={gpsData}
              selectedVehicle={selectedVehicle}
              onVehicleSelect={handleVehicleSelect}
            />


            <Analytics
              onVehicleSelect={handleVehicleSelect}
              selectedVehicle={selectedVehicle}
              vehicles={gpsData}
              externalTheme={theme}
            />





          </div>
        </div>
      </div>
    </div>
  );
};

export default GpsRecords;