import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import '../../asset/css/Analytics.css';

// ─── Selectors (only history + loading/error — vehicles come via props) ───────
const selectLoading = (s) => s.gpsData.loading;
const selectError = (s) => s.gpsData.error;
const selectHistory = (s) => s.gpsData.history ?? {};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const deriveStatus = (v) => {
    if (!v) return 'Unknown';
    if (v.ignition && v.speed > 0) return 'Moving';
    if (v.ignition && v.speed === 0) return 'Idle';
    return 'Stopped';
};

const parseLocation = (loc) => {
    if (!loc) return { latStr: '--', lngStr: '--', latF: null, lngF: null };
    // location format: "011.112330 076.942415" — split on whitespace
    const parts = loc.trim().split(/\s+/);
    if (parts.length < 2) return { latStr: '--', lngStr: '--', latF: null, lngF: null };
    const latF = parseFloat(parts[0]);
    const lngF = parseFloat(parts[1]);
    return {
        latF,
        lngF,
        latStr: isNaN(latF) ? '--' : latF.toFixed(6),
        lngStr: isNaN(lngF) ? '--' : lngF.toFixed(6),
    };
};

// ─── ArcGauge ────────────────────────────────────────────────────────────────
const ArcGauge = ({ value = 0, max = 100, label = '', unit = '', color = 'var(--accent)', size = 165, warnPct = 0.6, dangerPct = 0.85 }) => {
    const [anim, setAnim] = useState(0);
    useEffect(() => { const t = setTimeout(() => setAnim(value), 350); return () => clearTimeout(t); }, [value]);

    const r = size / 2 - 16, cx = size / 2, cy = size / 2;
    const startDeg = -200, arcDeg = 220;
    const pct = Math.min(anim / max, 1);
    const circ = 2 * Math.PI * r;
    const arcLen = (arcDeg / 360) * circ;
    const fillLen = pct * arcLen;
    const rotateBase = startDeg;
    const activeColor = pct >= dangerPct ? 'var(--red)' : pct >= warnPct ? 'var(--yellow)' : color;

    const needleRad = ((startDeg + pct * arcDeg) * Math.PI) / 180;
    const nx = cx + Math.cos(needleRad) * (r - 10);
    const ny = cy + Math.sin(needleRad) * (r - 10);

    const ticks = Array.from({ length: 13 }, (_, i) => {
        const rad = ((startDeg + (i / 12) * arcDeg) * Math.PI) / 180;
        const major = i % 3 === 0;
        return {
            x1: cx + Math.cos(rad) * (r - (major ? 14 : 8)),
            y1: cy + Math.sin(rad) * (r - (major ? 14 : 8)),
            x2: cx + Math.cos(rad) * (r - 2),
            y2: cy + Math.sin(rad) * (r - 2),
            major,
        };
    });

    return (
        <div style={{ textAlign: 'center' }}>
            <svg width={size} height={size} style={{ overflow: 'visible', filter: `drop-shadow(0 0 10px ${activeColor}44)` }}>
                <circle cx={cx} cy={cy} r={r + 7} fill="none" stroke={activeColor} strokeWidth="1" opacity="0.1" />
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth="12"
                    strokeDasharray={`${arcLen} ${circ - arcLen}`} strokeLinecap="round"
                    transform={`rotate(${rotateBase} ${cx} ${cy})`} />
                <circle cx={cx} cy={cy} r={r} fill="none" stroke={activeColor} strokeWidth="12"
                    strokeDasharray={`${fillLen} ${circ - fillLen}`} strokeLinecap="round"
                    transform={`rotate(${rotateBase} ${cx} ${cy})`}
                    style={{ transition: 'stroke-dasharray 1s cubic-bezier(.4,0,.2,1), stroke 0.4s' }} />
                {ticks.map((t, i) => (
                    <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                        stroke={t.major ? 'var(--text-secondary)' : 'var(--text-muted)'}
                        strokeWidth={t.major ? 1.5 : 0.8} />
                ))}
                <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={activeColor} strokeWidth="2.5" strokeLinecap="round"
                    style={{ transition: 'x2 1s cubic-bezier(.4,0,.2,1), y2 1s cubic-bezier(.4,0,.2,1)', filter: `drop-shadow(0 0 4px ${activeColor})` }} />
                <circle cx={cx} cy={cy} r="5" fill={activeColor} style={{ filter: `drop-shadow(0 0 7px ${activeColor})` }} />
                <circle cx={cx} cy={cy} r="2.5" fill="var(--bg)" />
                <text x={cx} y={cy + 26} textAnchor="middle" fill={activeColor} fontSize="19" fontWeight="700"
                    fontFamily="Orbitron" style={{ filter: `drop-shadow(0 0 5px ${activeColor})` }}>
                    {Math.round(anim)}
                </text>
                <text x={cx} y={cy + 40} textAnchor="middle" fill="var(--text-secondary)" fontSize="8"
                    fontFamily="Rajdhani" letterSpacing="2">{unit}</text>
            </svg>
            <div style={{ fontSize: '9px', color: 'var(--text-secondary)', fontFamily: 'Rajdhani', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: '3px' }}>
                {label}
            </div>
        </div>
    );
};

// ─── SegGauge ────────────────────────────────────────────────────────────────
const SegGauge = ({ value = 0, max = 100, label = '', icon = '', color = 'var(--accent)' }) => {
    const [anim, setAnim] = useState(0);
    useEffect(() => { const t = setTimeout(() => setAnim(value), 500); return () => clearTimeout(t); }, [value]);

    const pct = Math.min(anim / max, 1);
    const activeColor = pct < 0.2 ? 'var(--red)' : pct < 0.4 ? 'var(--yellow)' : color;
    const total = 14;

    return (
        <div className="an-seg">
            <div className="an-seg__icon">{icon}</div>
            <div className="an-seg__bar">
                {Array.from({ length: total }, (_, i) => {
                    const threshold = (i + 1) / total;
                    const filled = pct >= threshold;
                    const segColor = threshold > 0.85 ? 'var(--green)' : threshold > 0.5 ? color : threshold > 0.25 ? 'var(--yellow)' : 'var(--red)';
                    return (
                        <div key={i} className="an-seg__seg" style={{
                            background: filled ? segColor : 'var(--border)',
                            boxShadow: filled ? `0 0 5px ${segColor}80` : 'none',
                            transition: `background 0.6s ease ${i * 0.04}s, box-shadow 0.6s ease`,
                        }} />
                    );
                })}
            </div>
            <div className="an-seg__pct" style={{ color: activeColor }}>{Math.round(pct * 100)}%</div>
            <div className="an-seg__lbl">{label}</div>
        </div>
    );
};

// ─── TempRing ────────────────────────────────────────────────────────────────
const TempRing = ({ value = 60, min = 50, max = 120, label = 'Engine' }) => {
    const [anim, setAnim] = useState(min);
    useEffect(() => { const t = setTimeout(() => setAnim(value), 600); return () => clearTimeout(t); }, [value]);
    const pct = (anim - min) / (max - min);
    const color = pct > 0.8 ? 'var(--red)' : pct > 0.6 ? 'var(--orange)' : 'var(--cyan)';
    const r = 34, cx = 42, cy = 42, circ = 2 * Math.PI * r;
    const filled = Math.max(0, pct * circ * 0.78);
    return (
        <div style={{ textAlign: 'center' }}>
            <svg width={84} height={84} style={{ filter: `drop-shadow(0 0 7px ${color}55)` }}>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth="8"
                    strokeDasharray={`${circ * 0.78} ${circ * 0.22}`} strokeLinecap="round" transform={`rotate(129 ${cx} ${cy})`} />
                <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="8"
                    strokeDasharray={`${filled} ${circ - filled}`} strokeLinecap="round" transform={`rotate(129 ${cx} ${cy})`}
                    style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1), stroke 0.5s' }} />
                <text x={cx} y={cx + 5} textAnchor="middle" fill={color} fontSize="12" fontWeight="700" fontFamily="Orbitron">
                    {Math.round(anim)}°
                </text>
            </svg>
            <div style={{ fontSize: '9px', color: 'var(--text-secondary)', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Rajdhani' }}>{label}</div>
        </div>
    );
};

// ─── GForceMeter ─────────────────────────────────────────────────────────────
const GForceMeter = ({ tick = 0 }) => {
    const bx = 42 + Math.sin(tick * 0.7) * 10;
    const by = 42 - Math.cos(tick * 0.5) * 8;
    return (
        <div style={{ textAlign: 'center' }}>
            <svg width={84} height={84} style={{ filter: 'drop-shadow(0 0 5px var(--orange))' }}>
                <circle cx={42} cy={42} r={34} fill="none" stroke="var(--border)" strokeWidth="1" />
                <circle cx={42} cy={42} r={22} fill="none" stroke="var(--text-muted)" strokeWidth="0.6" strokeDasharray="3 3" />
                <circle cx={42} cy={42} r={10} fill="none" stroke="var(--text-muted)" strokeWidth="0.6" />
                <line x1={42} y1={8} x2={42} y2={76} stroke="var(--text-muted)" strokeWidth="0.5" opacity="0.5" />
                <line x1={8} y1={42} x2={76} y2={42} stroke="var(--text-muted)" strokeWidth="0.5" opacity="0.5" />
                <circle cx={bx} cy={by} r={6} fill="var(--orange)" style={{ filter: 'drop-shadow(0 0 6px var(--orange))', transition: 'cx 0.3s, cy 0.3s' }} />
                <circle cx={bx} cy={by} r={10} fill="none" stroke="var(--orange)" strokeWidth="1" opacity="0.4" />
            </svg>
            <div style={{ fontSize: '9px', color: 'var(--text-secondary)', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Rajdhani' }}>G-Force</div>
        </div>
    );
};

// ─── Odometer ────────────────────────────────────────────────────────────────
const Odometer = ({ value = 0 }) => (
    <div className="an-odo">
        <div className="an-odo__display">{Number(value).toLocaleString()}</div>
        <div className="an-odo__lbl">Odometer (km)</div>
    </div>
);

// ─── Sparkline ───────────────────────────────────────────────────────────────
// Global counter — unique SVG gradient id per instance (charCodeAt caused collisions)
let _spkId = 0;

const Sparkline = ({ data = [], color = 'var(--accent)', width = 200, height = 44 }) => {
    const [id] = useState(() => `spk_${++_spkId}`);

    if (data.length < 2) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    // If all values identical (e.g. all zeros), add tiny range so line renders flat
    const range = max - min || 1;

    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - 4 - ((v - min) / range) * (height - 10);
        return `${x},${y}`;
    }).join(' ');
    const area = `0,${height} ${pts} ${width},${height}`;
    const lastPt = pts.split(' ').pop().split(',');
    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            width="100%"
            height={height}
            preserveAspectRatio="none"
            style={{ display: 'block' }}
        >
            <defs>
                <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon points={area} fill={`url(#${id})`} />
            <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
            <circle cx={lastPt[0]} cy={lastPt[1]} r="3" fill={color}
                style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
        </svg>
    );
};


/* ════════════════════════════════════════════════════════════════════════════
   MAIN ANALYTICS COMPONENT

   Props:
     vehicles        {Array}    — full fleet list passed from GpsRecords
     selectedVehicle {Object}   — vehicle selected in parent's Sidebar (or null)
     onVehicleSelect {Function} — call parent when user clicks a card in this list
════════════════════════════════════════════════════════════════════════════ */
const Analytics = ({ onVehicleSelect, selectedVehicle, vehicles = [] }) => {
    // Pull only history + status flags from Redux — vehicle list is via props
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const history = useSelector(selectHistory);

    const [tick, setTick] = useState(0);

    // Tick drives G-Force animation and odometer increment
    useEffect(() => {
        const id = setInterval(() => setTick(t => t + 1), 1800);
        return () => clearInterval(id);
    }, []);

    // ── Active vehicle:
    //    Priority 1 → selectedVehicle from parent Sidebar
    //    Priority 2 → first vehicle in list (so gauges are never blank)
    const v = selectedVehicle ?? vehicles[0] ?? null;
    const loc = parseLocation(v?.location);

    // ── Redux history for the active vehicle ────────────────────
    const vHistory = v ? (history[v.imei] ?? []) : [];
    // Always ensure at least 5 data points so sparklines render even before history builds
    const speedHist = vHistory.length >= 2
        ? vHistory.map(p => p.speed ?? 0)
        : Array(5).fill(v?.speed ?? 0);
    const last10spd = speedHist.slice(-10);

    // ── Fleet KPIs from props ───────────────────────────────────
    const total = vehicles.length;
    const moving = vehicles.filter(x => x.ignition && x.speed > 0).length;
    const idle = vehicles.filter(x => x.ignition && x.speed === 0).length;
    const stopped = vehicles.filter(x => !x.ignition).length;
    const avgSpd = total
        ? Math.round(vehicles.reduce((s, x) => s + (x.speed ?? 0), 0) / total)
        : 0;

    // ── Live alerts derived from props vehicles ─────────────────
    const liveAlerts = [];
    vehicles.forEach(veh => {
        if (veh.speed > 80)
            liveAlerts.push({ icon: '⚠️', text: `${veh.vehicle ?? veh.imei} overspeed (${veh.speed} km/h)`, severity: 'critical', time: veh.time ?? '' });
        if (!veh.ignition && veh.speed > 0)
            liveAlerts.push({ icon: '🚨', text: `${veh.vehicle ?? veh.imei} moving without ignition`, severity: 'critical', time: veh.time ?? '' });
    });
    if (!liveAlerts.length)
        liveAlerts.push({ icon: '✅', text: 'All vehicles operating normally', severity: 'ok', time: 'Now' });

    // ── Quick stats for active vehicle ──────────────────────────
    const vStatus = deriveStatus(v);
    const quickStats = v ? [
        { key: 'Vehicle', val: v.vehicle ?? '—' },
        { key: 'IMEI', val: v.imei ?? '—' },
        { key: 'Status', val: vStatus },
        { key: 'Ignition', val: v.ignition ? '🟢 ON' : '🔴 OFF' },
        { key: 'Speed', val: `${v.speed ?? 0} km/h` },
        { key: 'Latitude', val: loc.latStr },
        { key: 'Longitude', val: loc.lngStr },
        { key: 'Last Update', val: v.time ?? '—' },
    ] : [];

    // ── First-load guard ────────────────────────────────────────
    if (loading && vehicles.length === 0) {
        return (
            <div className="analytics-root">
                <div className="an-loading">
                    <div className="an-loading__spinner" />
                    <div className="an-loading__text">FETCHING GPS DATA…</div>
                </div>
            </div>
        );
    }

    return (
        <div className="analytics-root">

            {/* Error banner */}
            {error && <div className="an-error">⚠️ {String(error)}</div>}

            {/* Empty state */}
            {vehicles.length === 0 ? (
                <div className="an-empty">No vehicle data available. Check GPS connection.</div>
            ) : (
                <div className="an-main">

                    {/* ══ CENTER — Gauges & Charts ════════════════════════════ */}
                    <div className="an-center">

                        {!v && (
                            <div className="an-empty" style={{ marginTop: 60 }}>
                                Select a vehicle from the sidebar to view telemetry.
                            </div>
                        )}

                        {/* Info bar */}
                        {v && (
                            <div className="an-infobar">
                                <div>
                                    <div className="an-infobar__name">{v.vehicle ?? v.imei}</div>
                                    <div className="an-infobar__sub">IMEI: {v.imei}</div>
                                </div>
                                <div className="an-infobar__meta">
                                    {[
                                        [loc.latStr, 'LAT'],
                                        [loc.lngStr, 'LNG'],
                                        [v.ignition ? '● ON' : '○ OFF', 'IGN'],
                                        [v.time ? v.time.slice(11, 19) : '--', 'TIME'],
                                    ].map(([val, lbl], i) => (
                                        <div key={i} className="an-infobar__meta-item">
                                            <div className="an-infobar__meta-val" style={{
                                                color: lbl === 'IGN'
                                                    ? (v.ignition ? 'var(--green)' : 'var(--red)')
                                                    : lbl === 'LAT' || lbl === 'LNG'
                                                        ? 'var(--text-primary)'
                                                        : 'var(--cyan)',
                                                fontSize: (lbl === 'LAT' || lbl === 'LNG') ? '9px' : '10px',
                                            }}>{val}</div>
                                            <div className="an-infobar__meta-lbl">{lbl}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Arc gauges */}
                        {v && (
                            <div className="an-gauge-panel">
                                <div className="an-gauge-panel__grid">
                                    <ArcGauge
                                        value={v.speed ?? 0}
                                        max={160}
                                        label="Current Speed"
                                        unit="KM / H"
                                        color="var(--accent)"
                                        warnPct={0.5}
                                        dangerPct={0.75}
                                    />
                                    <ArcGauge
                                        value={speedHist.length >= 1
                                            ? Math.round(speedHist.reduce((a, b) => a + b, 0) / speedHist.length)
                                            : 0}
                                        max={160}
                                        label="Avg Speed"
                                        unit="KM / H"
                                        color="var(--purple)"
                                        warnPct={0.5}
                                        dangerPct={0.75}
                                    />
                                    <ArcGauge
                                        value={Math.min(speedHist.length >= 1 ? Math.max(...speedHist) : 0, 160)}
                                        max={160}
                                        label="Max Speed"
                                        unit="KM / H"
                                        color="var(--cyan)"
                                        warnPct={0.5}
                                        dangerPct={0.75}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Systems */}
                        {v && (
                            <div className="an-systems">
                                <div className="an-section-label" style={{ marginBottom: 12 }}>Systems Status</div>
                                <div className="an-systems__row">
                                    <SegGauge value={v.ignition ? Math.max(20, 80 - speedHist.length * 0.5) : 60} max={100} label="Signal" icon="📡" color="var(--accent)" />
                                    <SegGauge value={v.ignition ? 85 : 40} max={100} label="Battery" icon="🔋" color="var(--green)" />
                                    <TempRing value={v.ignition && v.speed > 0 ? 75 + (v.speed / 120) * 30 : 55} label="Engine" />
                                    <GForceMeter tick={tick} />
                                    <Odometer value={84230 + tick * 2} />
                                </div>
                            </div>
                        )}

                        {/* Sparklines — always shown when vehicle is selected */}
                        {v && (
                            <div className="an-spark-grid">
                                {[
                                    {
                                        label: 'Speed History',
                                        data: last10spd,
                                        color: 'var(--accent)',
                                        unit: 'km/h',
                                        val: `${v.speed ?? 0}`,
                                    },
                                    {
                                        label: 'Trip Speeds',
                                        data: vHistory.length >= 2
                                            ? vHistory.slice(-10).map(p => p.speed ?? 0)
                                            : Array(5).fill(0),
                                        color: 'var(--yellow)',
                                        unit: 'km/h',
                                        val: speedHist.length
                                            ? `${Math.max(...speedHist)}`
                                            : '0',
                                    },
                                    {
                                        label: 'Updates',
                                        data: vHistory.length >= 2
                                            ? vHistory.slice(-10).map((_, i) => i + 1)
                                            : [1, 2, 3, 4, 5],
                                        color: 'var(--purple)',
                                        unit: 'pts',
                                        val: `${vHistory.length}`,
                                    },
                                ].map((s, i) => (
                                    <div key={i} className="an-spark-card">
                                        <div className="an-spark-card__hdr">
                                            <span className="an-spark-card__lbl">{s.label}</span>
                                            <span className="an-spark-card__val" style={{ color: s.color }}>
                                                {s.val} {s.unit}
                                            </span>
                                        </div>
                                        <Sparkline data={s.data} color={s.color} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ══ RIGHT — Alerts + Stats ══════════════════════════════ */}
                    <div className="an-right">

                        {/* Alerts */}
                        <div className="an-alerts">
                            <div className="an-alerts__hdr">
                                <span className="an-alerts__title">Alerts</span>
                                {liveAlerts.filter(a => a.severity === 'critical').length > 0 && (
                                    <span className="an-alerts__badge an-blink">
                                        {liveAlerts.filter(a => a.severity === 'critical').length} CRIT
                                    </span>
                                )}
                            </div>
                            {liveAlerts.slice(0, 5).map((a, i) => (
                                <div key={i} className="an-alert-item">
                                    <span className="an-alert-item__icon">{a.icon}</span>
                                    <div>
                                        <div className="an-alert-item__text" style={{
                                            color: a.severity === 'critical' ? 'var(--red)'
                                                : a.severity === 'warning' ? 'var(--orange)'
                                                    : 'var(--green)',
                                        }}>{a.text}</div>
                                        <div className="an-alert-item__time">{a.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Vehicle Details */}
                        {v && (
                            <div className="an-stats">
                                <div className="an-stats__title">Vehicle Details</div>
                                {quickStats.map((s, i) => (
                                    <div key={i} className="an-stats__row">
                                        <span className="an-stats__key">{s.key}</span>
                                        <span className="an-stats__val" style={{
                                            color: s.key === 'Status'
                                                ? (s.val === 'Moving' ? 'var(--green)' : s.val === 'Idle' ? 'var(--yellow)' : 'var(--red)')
                                                : undefined
                                        }}>{s.val}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Fleet Summary */}
                        <div className="an-stats">
                            <div className="an-stats__title">Fleet Summary</div>
                            {[
                                { key: 'Total', val: total },
                                { key: 'Moving', val: moving },
                                { key: 'Idle', val: idle },
                                { key: 'Stopped', val: stopped },
                                { key: 'Avg Spd', val: `${avgSpd} km/h` },
                            ].map((s, i) => (
                                <div key={i} className="an-stats__row">
                                    <span className="an-stats__key">{s.key}</span>
                                    <span className="an-stats__val">{s.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default Analytics;