import React, { useState } from 'react';
import {
    LineChart, Line, BarChart, Bar,
    PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer,
    Area, AreaChart
} from 'recharts';
import VEHICLES from '../../constants/vehicleData';

// ── Data ──────────────────────────────────────────────────────────

const generateSpeedHistory = () => [
    { time: '10:00', speed: 0 },
    { time: '10:05', speed: 25 },
    { time: '10:10', speed: 45 },
    { time: '10:15', speed: 62 },
    { time: '10:20', speed: 55 },
    { time: '10:25', speed: 38 },
    { time: '10:30', speed: 0 },
    { time: '10:35', speed: 20 },
    { time: '10:40', speed: 48 },
    { time: '10:45', speed: 71 },
    { time: '10:50', speed: 60 },
    { time: '10:55', speed: 45 },
];

const batteryData = VEHICLES.map(v => ({
    name: v.name.replace('Truck ', 'T'),  // short label
    battery: v.battery,
    color: v.battery > 50 ? '#22c55e' : v.battery > 20 ? '#f97316' : '#ef4444'
}));

const getStatusData = () => {
    const moving = VEHICLES.filter(v => v.ignition && v.speed > 0).length;
    const idling = VEHICLES.filter(v => v.ignition && v.speed === 0).length;
    const offline = VEHICLES.filter(v => !v.ignition).length;
    return [
        { name: 'Moving', value: moving, color: '#22c55e' },
        { name: 'Idling', value: idling, color: '#f97316' },
        { name: 'Offline', value: offline, color: '#ef4444' },
    ];
};

const tripData = VEHICLES.map(v => ({
    name: v.name.replace('Truck ', 'T'),
    km: parseFloat((Math.random() * 120 + 10).toFixed(1)),
    trips: Math.floor(Math.random() * 8 + 1)
}));

// ── Summary Cards Data ────────────────────────────────────────────
const getSummaryCards = () => {
    const totalKm = tripData.reduce((sum, v) => sum + v.km, 0).toFixed(0);
    const avgBattery = Math.round(VEHICLES.reduce((s, v) => s + v.battery, 0) / VEHICLES.length);
    const avgSpeed = Math.round(VEHICLES.filter(v => v.speed > 0).reduce((s, v) => s + v.speed, 0) / VEHICLES.filter(v => v.speed > 0).length || 0);
    const moving = VEHICLES.filter(v => v.ignition && v.speed > 0).length;

    return [
        { label: 'Total Distance', value: `${totalKm} km`, icon: '🛣️', color: '#3b82f6' },
        { label: 'Avg Battery', value: `${avgBattery}%`, icon: '🔋', color: '#22c55e' },
        { label: 'Avg Speed', value: `${avgSpeed} km/h`, icon: '⚡', color: '#f97316' },
        { label: 'Active Now', value: `${moving}`, icon: '🚛', color: '#8b5cf6' },
    ];
};

// ── Custom Tooltip ────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: 'rgba(15,23,42,0.95)',
            border: '1px solid #1e3a5f',
            borderRadius: 10,
            padding: '10px 14px',
            fontSize: 12,
            color: '#f1f5f9',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
            <p style={{ margin: '0 0 6px', color: '#64748b', fontSize: 11 }}>{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ margin: '2px 0', color: p.color || '#7dd3fc', fontWeight: 600 }}>
                    {p.name}: {p.value}
                    {p.dataKey === 'speed' ? ' km/h' :
                        p.dataKey === 'battery' ? '%' :
                            p.dataKey === 'km' ? ' km' : ''}
                </p>
            ))}
        </div>
    );
};

// ── Tab Button ────────────────────────────────────────────────────
const TabBtn = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        background: active
            ? 'linear-gradient(135deg, #1e3a5f, #2d5a8e)'
            : 'rgba(255,255,255,0.03)',
        border: active ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.06)',
        color: active ? '#7dd3fc' : '#475569',
        borderRadius: 8,
        padding: '5px 12px',
        cursor: 'pointer',
        fontSize: 11,
        fontWeight: active ? 700 : 400,
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
        boxShadow: active ? '0 0 12px rgba(59,130,246,0.2)' : 'none',
    }}>
        <span>{icon}</span>
        <span>{label}</span>
    </button>
);

// ── Summary Card ──────────────────────────────────────────────────
const SummaryCard = ({ icon, label, value, color }) => (
    <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${color}22`,
        borderRadius: 10,
        padding: '8px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flex: 1,
        minWidth: 120,
    }}>
        <div style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: `${color}18`,
            border: `1px solid ${color}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            flexShrink: 0,
        }}>
            {icon}
        </div>
        <div>
            <p style={{ margin: 0, color: '#475569', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {label}
            </p>
            <p style={{ margin: 0, color, fontWeight: 700, fontSize: 15 }}>
                {value}
            </p>
        </div>
    </div>
);

// ── Main Component ────────────────────────────────────────────────
const StatsPanel = ({ selectedVehicle, isOpen, onToggle }) => {
    const [activeTab, setActiveTab] = useState('speed');

    const statusData = getStatusData();
    const speedHistory = generateSpeedHistory();
    const summaryCards = getSummaryCards();

    const tabs = [
        { id: 'speed', icon: '⚡', label: 'Speed' },
        { id: 'battery', icon: '🔋', label: 'Battery' },
        { id: 'status', icon: '📡', label: 'Status' },
        { id: 'distance', icon: '🛣️', label: 'Distance' },
    ];

    return (
        <div style={{
            height: isOpen ? '280px' : '42px',
            transition: 'height 0.35s cubic-bezier(0.4,0,0.2,1)',
            background: 'linear-gradient(180deg, #0d1829 0%, #0a0f1e 100%)',
            borderTop: '1px solid #1e3a5f',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
        }}>

            {/* ── Header ────────────────────────────────────── */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                height: 42,
                flexShrink: 0,
                borderBottom: isOpen ? '1px solid #1e3a5f' : 'none',
                background: 'rgba(255,255,255,0.02)',
            }}>
                {/* Left */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {/* Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: '#3b82f6',
                            boxShadow: '0 0 6px #3b82f6',
                            display: 'inline-block'
                        }} />
                        <span style={{
                            color: '#7dd3fc',
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase'
                        }}>
                            Analytics
                        </span>
                    </div>

                    {/* Tabs */}
                    {isOpen && (
                        <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
                            {tabs.map(tab => (
                                <TabBtn
                                    key={tab.id}
                                    icon={tab.icon}
                                    label={tab.label}
                                    active={activeTab === tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Toggle */}
                <button onClick={onToggle} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid #1e3a5f',
                    color: '#475569',
                    borderRadius: 7,
                    padding: '3px 10px',
                    cursor: 'pointer',
                    fontSize: 11,
                    transition: 'all 0.2s',
                }}>
                    <span>{isOpen ? '▼' : '▲'}</span>
                    <span>{isOpen ? 'Hide' : 'Show'}</span>
                </button>
            </div>

            {/* ── Content ───────────────────────────────────── */}
            {isOpen && (
                <div style={{
                    flex: 1,
                    display: 'flex',
                    gap: 12,
                    padding: '10px 16px',
                    overflow: 'hidden',
                }}>

                    {/* ── Left: Summary Cards ── */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                        width: 180,
                        flexShrink: 0,
                    }}>
                        {summaryCards.map(card => (
                            <SummaryCard key={card.label} {...card} />
                        ))}
                    </div>

                    {/* ── Divider ── */}
                    <div style={{
                        width: 1,
                        background: '#1e3a5f',
                        flexShrink: 0,
                        margin: '0 4px'
                    }} />

                    {/* ── Right: Chart ── */}
                    <div style={{ flex: 1, overflow: 'hidden' }}>

                        {/* ── Speed Tab — Area Chart ── */}
                        {activeTab === 'speed' && (
                            <>
                                <p style={{ color: '#334155', fontSize: 10, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {selectedVehicle ? `${selectedVehicle.name} — Speed History` : 'Select a vehicle to view speed history'}
                                </p>
                                <ResponsiveContainer width="100%" height={185}>
                                    <AreaChart data={speedHistory}>
                                        <defs>
                                            <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" />
                                        <XAxis dataKey="time" tick={{ fill: '#334155', fontSize: 9 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: '#334155', fontSize: 9 }} unit="km/h" width={50} axisLine={false} tickLine={false} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="speed"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            fill="url(#speedGrad)"
                                            dot={false}
                                            activeDot={{ r: 5, fill: '#3b82f6', stroke: '#0f172a', strokeWidth: 2 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </>
                        )}

                        {/* ── Battery Tab ── */}
                        {activeTab === 'battery' && (
                            <>
                                <p style={{ color: '#334155', fontSize: 10, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    All vehicles — Battery levels
                                </p>
                                <ResponsiveContainer width="100%" height={185}>
                                    <BarChart data={batteryData} barSize={18}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" />
                                        <XAxis dataKey="name" tick={{ fill: '#334155', fontSize: 9 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: '#334155', fontSize: 9 }} unit="%" domain={[0, 100]} axisLine={false} tickLine={false} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="battery" radius={[6, 6, 0, 0]} background={{ fill: '#0f172a', radius: 6 }}>
                                            {batteryData.map((entry, i) => (
                                                <Cell key={i} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </>
                        )}

                        {/* ── Status Tab ── */}
                        {activeTab === 'status' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 20, height: '100%' }}>
                                <ResponsiveContainer width={180} height={185}>
                                    <PieChart>
                                        <defs>
                                            {statusData.map((s, i) => (
                                                <radialGradient key={i} id={`pie${i}`} cx="50%" cy="50%" r="50%">
                                                    <stop offset="0%" stopColor={s.color} stopOpacity={1} />
                                                    <stop offset="100%" stopColor={s.color} stopOpacity={0.7} />
                                                </radialGradient>
                                            ))}
                                        </defs>
                                        <Pie
                                            data={statusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={75}
                                            paddingAngle={4}
                                            dataKey="value"
                                            strokeWidth={0}
                                        >
                                            {statusData.map((entry, i) => (
                                                <Cell key={i} fill={`url(#pie${i})`} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>

                                {/* Legend */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {statusData.map(item => (
                                        <div key={item.name} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10,
                                            background: `${item.color}11`,
                                            border: `1px solid ${item.color}22`,
                                            borderRadius: 8,
                                            padding: '6px 14px',
                                            minWidth: 140,
                                        }}>
                                            <span style={{
                                                width: 10, height: 10,
                                                borderRadius: '50%',
                                                background: item.color,
                                                boxShadow: `0 0 8px ${item.color}`,
                                                flexShrink: 0
                                            }} />
                                            <span style={{ color: '#94a3b8', fontSize: 12, flex: 1 }}>{item.name}</span>
                                            <span style={{ color: item.color, fontWeight: 700, fontSize: 16 }}>
                                                {item.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Distance Tab ── */}
                        {activeTab === 'distance' && (
                            <>
                                <p style={{ color: '#334155', fontSize: 10, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Distance & trips today — all vehicles
                                </p>
                                <ResponsiveContainer width="100%" height={185}>
                                    <BarChart data={tripData} barSize={12} barGap={2}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" />
                                        <XAxis dataKey="name" tick={{ fill: '#334155', fontSize: 9 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: '#334155', fontSize: 9 }} axisLine={false} tickLine={false} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="km" name="km" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="trips" name="trips" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
};

export default StatsPanel;