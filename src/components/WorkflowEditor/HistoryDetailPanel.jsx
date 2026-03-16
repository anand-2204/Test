import React from 'react';
import { CheckCircle, XCircle, Clock, User, Calendar, AlertTriangle, X } from 'lucide-react';
import '../../asset/css/WorkflowEditor.css';

const HistoryDetailPanel = ({ historyItem, onClose }) => {
    if (!historyItem) return null;

    const formatDateTime = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    };

    return (
        <aside className="history-detail-panel">
            <div className="history-detail-header">
                <div className="history-detail-title">
                    <div className={`history-detail-status-icon ${historyItem.status}`}>
                        {historyItem.status === 'success'
                            ? <CheckCircle size={22} />
                            : <XCircle size={22} />
                        }
                    </div>
                    <div>
                        <h3>{historyItem.workflowName}</h3>
                        <span className={`history-status-badge ${historyItem.status}`}>{historyItem.status}</span>
                    </div>
                </div>
                <button className="history-detail-close" onClick={onClose}>
                    <X size={18} />
                </button>
            </div>

            <div className="history-detail-content">
                {/* Summary Info */}
                <div className="history-detail-section">
                    <h4>Execution Summary</h4>
                    <div className="history-summary-grid">
                        <div className="summary-item">
                            <Calendar size={14} />
                            <span className="summary-label">Triggered</span>
                            <span className="summary-value">{formatDateTime(historyItem.triggeredAt)}</span>
                        </div>
                        <div className="summary-item">
                            <Calendar size={14} />
                            <span className="summary-label">Completed</span>
                            <span className="summary-value">{formatDateTime(historyItem.completedAt)}</span>
                        </div>
                        <div className="summary-item">
                            <Clock size={14} />
                            <span className="summary-label">Duration</span>
                            <span className="summary-value">{historyItem.duration}</span>
                        </div>
                        <div className="summary-item">
                            <User size={14} />
                            <span className="summary-label">Triggered By</span>
                            <span className="summary-value">{historyItem.triggeredBy}</span>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {historyItem.error && (
                    <div className="history-detail-section">
                        <div className="history-error-box">
                            <AlertTriangle size={16} />
                            <span>{historyItem.error}</span>
                        </div>
                    </div>
                )}

                {/* Node Execution Timeline */}
                <div className="history-detail-section">
                    <h4>Node Execution Timeline</h4>
                    <div className="history-timeline">
                        {historyItem.nodes.map((node, index) => (
                            <div key={index} className={`timeline-node ${node.status}`}>
                                <div className="timeline-connector">
                                    <div className={`timeline-dot ${node.status}`}>
                                        {node.status === 'success'
                                            ? <CheckCircle size={14} />
                                            : <XCircle size={14} />
                                        }
                                    </div>
                                    {index < historyItem.nodes.length - 1 && <div className="timeline-line" />}
                                </div>
                                <div className="timeline-content">
                                    <div className="timeline-node-header">
                                        <h5>{node.title}</h5>
                                        <span className={`timeline-status-tag ${node.status}`}>{node.status}</span>
                                    </div>
                                    <p className="timeline-message">{node.message}</p>
                                    <div className="timeline-time">
                                        <Clock size={11} />
                                        <span>{node.startedAt} → {node.endedAt}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default HistoryDetailPanel;
