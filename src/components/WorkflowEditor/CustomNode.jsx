import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { WORKFLOW_ITEMS } from '../../constants/workflowConfig';

const CustomNode = ({ data, selected }) => {
  // Find original node definition for the Icon since functions shouldn't be in flow state

  const originalItem = [...WORKFLOW_ITEMS.tasks, ...WORKFLOW_ITEMS.actions]
    .find(item => item.id === data.originalId);
  const Icon = originalItem ? originalItem.icon : null;

  return (
    <div className={`custom-node ${selected ? 'selected' : ''}`} style={{ borderColor: selected ? data.color : '#e2e8f0' }}>
      {/* Target handle (Input) */}
      <Handle
        type="target"
        position={Position.Top}
        className="node-handle"
      />

      <div className="node-content">
        <div className="node-icon-wrapper" style={{ color: data.color, backgroundColor: `${data.color}15` }}>
          {Icon && <Icon size={20} />}
        </div>
        <div className="node-text">
          <div className="node-title">{data.title}</div>
          <div className="node-subtitle">{data.type === 'task' ? 'Task Node' : 'Action Node'}</div>
        </div>
      </div>

      {/* Source handle (Output) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="node-handle"
      />
    </div>
  );
};

export default memo(CustomNode);
