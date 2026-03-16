import React, { useState } from 'react';
import { WORKFLOW_HISTORY } from '../../constants/historyData';
import { CheckCircle, XCircle, Clock, ChevronRight, ArrowLeft } from 'lucide-react';
import '../../asset/css/WorkflowEditor.css';

const HistorySidebar = ({ onSelectHistory, onClose }) => {
    const [filter, setFilter] = useState('all');

    const filteredHistory = WORKFLOW_HISTORY.filter((item) => {
        if (filter === 'all') return true;
        return item.status === filter;
    });

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatTime = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <aside className="history-sidebar">
            <div className="history-sidebar-header">
                <button className="history-back-btn" onClick={onClose}>
                    <ArrowLeft size={18} />
                </button>
                <h3>Execution History</h3>
            </div>

            <div className="history-filters">
                <button
                    className={`history-filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All
                </button>
                <button
                    className={`history-filter-btn success ${filter === 'success' ? 'active' : ''}`}
                    onClick={() => setFilter('success')}
                >
                    Success
                </button>
                <button
                    className={`history-filter-btn failed ${filter === 'failed' ? 'active' : ''}`}
                    onClick={() => setFilter('failed')}
                >
                    Failed
                </button>
            </div>

            <div className="history-list">
                {filteredHistory.map((item) => (
                    <div
                        key={item.id}
                        className={`history-item ${item.status}`}
                        onClick={() => onSelectHistory(item)}
                    >
                        <div className="history-item-status">
                            {item.status === 'success'
                                ? <CheckCircle size={18} className="status-icon success" />
                                : <XCircle size={18} className="status-icon failed" />
                            }
                        </div>

                        <div className="history-item-info">
                            <h4>{item.workflowName}</h4>
                            <div className="history-item-meta">
                                <span className="history-date">{formatDate(item.triggeredAt)}</span>
                                <span className="history-time">{formatTime(item.triggeredAt)}</span>
                                <span className="history-duration">
                                    <Clock size={12} />
                                    {item.duration}
                                </span>
                            </div>
                        </div>
                        <ChevronRight size={16} className="history-chevron" />
                    </div>
                ))}

                {filteredHistory.length === 0 && (
                    <div className="history-empty">
                        <p>No {filter} executions found.</p>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default HistorySidebar;
