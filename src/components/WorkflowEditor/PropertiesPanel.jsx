import React from 'react';
import { WORKFLOW_ITEMS } from '../../constants/workflowConfig';
import { Trash2 } from 'lucide-react';
import './WorkflowEditor.css';

const PropertiesPanel = ({ selectedNode, updateNodeData, deleteNode }) => {
  if (!selectedNode) {
    return (
      <aside className="properties-panel empty">
        <div className="empty-state">
          <h3>No Node Selected</h3>
          <p>Select a node on the canvas to view and edit its properties.</p>
        </div>
      </aside>
    );
  }

  const { data, id } = selectedNode;
  
  const originalItem = [...WORKFLOW_ITEMS.tasks, ...WORKFLOW_ITEMS.actions]
    .find(item => item.id === data.originalId);
  const Icon = originalItem ? originalItem.icon : null;

  const handleDataChange = (key, value) => {
    updateNodeData(id, { ...data, defaultData: { ...data.defaultData, [key]: value } });
  };

  const renderProperties = () => {
    if (!data.defaultData || Object.keys(data.defaultData).length === 0) {
      return <p className="no-props">No configurable properties for this node.</p>;
    }

    return Object.entries(data.defaultData).map(([key, value]) => {
      // Basic formatting for keys (camelCase to Title Case)
      const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

      return (
        <div key={key} className="property-group">
          <label htmlFor={key}>{formattedKey}</label>
          {typeof value === 'boolean' ? (
            <input
              type="checkbox"
              id={key}
              checked={value}
              onChange={(e) => handleDataChange(key, e.target.checked)}
            />
          ) : typeof value === 'number' ? (
            <input
              type="number"
              id={key}
              value={value}
              onChange={(e) => handleDataChange(key, Number(e.target.value))}
            />
          ) : (
            <input
              type="text"
              id={key}
              value={value}
              onChange={(e) => handleDataChange(key, e.target.value)}
            />
          )}
        </div>
      );
    });
  };

  return (
    <aside className="properties-panel">
      <div className="panel-header">
        <div className="panel-icon" style={{ color: data.color, backgroundColor: `${data.color}15` }}>
           {Icon && <Icon size={24} />}
        </div>
        <div className="panel-title">
          <h3>{data.title}</h3>
          <span className="node-type-badge">{data.type}</span>
        </div>
      </div>
      
      <div className="panel-content">
        <div className="property-section">
          <h4>Configuration</h4>
          {renderProperties()}
        </div>
        
        <div className="property-section meta-section">
          <h4>Metadata</h4>
          <div className="meta-info">
             <span className="meta-label">ID:</span>
             <span className="meta-value">{id}</span>
          </div>
          <div className="meta-info">
             <span className="meta-label">Description:</span>
             <span className="meta-value">{data.description}</span>
          </div>
          
          <button 
            className="delete-node-btn" 
            onClick={() => deleteNode(id)}
          >
            <Trash2 size={16} />
            Delete Node
          </button>
        </div>
      </div>
    </aside>
  );
};

export default PropertiesPanel;
