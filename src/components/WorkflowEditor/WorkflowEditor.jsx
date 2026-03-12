import React, { useState, useCallback } from 'react';
import {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType
} from '@xyflow/react';
import Sidebar from './Sidebar';
import PropertiesPanel from './PropertiesPanel';
import EditorCanvas from './EditorCanvas';
import './WorkflowEditor.css';

const WorkflowEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({
      ...params,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#94a3b8', strokeWidth: 3 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 15,
        height: 15,
        color: '#94a3b8',
      },
    }, eds)),
    [setEdges]
  );

  // Find selected node
  const selectedNode = nodes.find(n => n.selected);

  // Update specific node data based on id
  const updateNodeData = useCallback((id, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: newData,
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  // Delete node and its connected edges
  const deleteNode = useCallback((id) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  }, [setNodes, setEdges]);

  return (
    <div className="workflow-editor-container">
      <ReactFlowProvider>
        <Sidebar />
        <EditorCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          setNodes={setNodes}
          setEdges={setEdges}
        />
        {selectedNode && (
          <PropertiesPanel
            selectedNode={selectedNode}
            updateNodeData={updateNodeData}
            deleteNode={deleteNode}
          />
        )}
      </ReactFlowProvider>
    </div>
  );
};

export default WorkflowEditor;
