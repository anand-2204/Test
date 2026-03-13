import React, { useState } from 'react';
import { WORKFLOW_ITEMS } from '../../constants/workflowConfig';
import { History } from 'lucide-react';
import './WorkflowEditor.css';

const Sidebar = ({ onToggleHistory }) => {
  const [activeTab, setActiveTab] = useState('tasks');

  const onDragStart = (event, item) => {
    // Only pass data we can stringify, not the React component itself
    const itemData = {
      ...item,
      iconName: item.icon.displayName || item.icon.name || 'Icon',
    };
    // Ensure we don't try to stringify the function component
    delete itemData.icon;

    event.dataTransfer.setData('application/reactflow', JSON.stringify(itemData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const renderItems = (items) => {
    return items.map((item) => {
      const Icon = item.icon;
      return (
        <div
          key={item.id}
          className="sidebar-node"
          onDragStart={(event) => onDragStart(event, item)}
          draggable
          style={{ borderColor: item.color }}
        >
          <div className="sidebar-node-icon" style={{ color: item.color, backgroundColor: `${item.color}15` }}>
            <Icon size={20} />
          </div>
          <div className="sidebar-node-info">
            <h4>{item.title}</h4>
            <p>{item.description}</p>
          </div>
        </div>
      );
    });
  };

  return (
    <aside className="workflow-sidebar">
      <div className="sidebar-header">
        <h3>Nodes Library</h3>
        <button className="history-toggle-btn" onClick={onToggleHistory} title="Execution History">
          <History size={18} />
        </button>
      </div>
      
      <div className="sidebar-tabs">
        <button 
          className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
        </button>
        <button 
          className={`tab-button ${activeTab === 'actions' ? 'active' : ''}`}
          onClick={() => setActiveTab('actions')}
        >
          Actions
        </button>
      </div>

      <div className="sidebar-content">
        {activeTab === 'tasks' 
          ? renderItems(WORKFLOW_ITEMS.tasks) 
          : renderItems(WORKFLOW_ITEMS.actions)}
      </div>
    </aside>
  );
};

export default Sidebar;
