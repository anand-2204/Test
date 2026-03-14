import React, { useState, useCallback } from 'react';
import {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType
} from '@xyflow/react';
import Sidebar from '../components/WorkflowEditor/Sidebar';
import PropertiesPanel from '../components/WorkflowEditor/PropertiesPanel';
import EditorCanvas from '../components/WorkflowEditor/EditorCanvas';
import HistorySidebar from '../components/WorkflowEditor/HistorySidebar';
import HistoryDetailPanel from '../components/WorkflowEditor/HistoryDetailPanel';
import '../components/WorkflowEditor/WorkflowEditor.css';

const WorkflowEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // History state
  const [showHistory, setShowHistory] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);

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

  // History handlers
  const handleToggleHistory = () => {
    setShowHistory((prev) => !prev);
    setSelectedHistory(null);
  };

  const handleSelectHistory = (item) => {
    setSelectedHistory(item);
  };

  const handleCloseHistoryDetail = () => {
    setSelectedHistory(null);
  };

  const handleCloseHistory = () => {
    setShowHistory(false);
    setSelectedHistory(null);
  };

  return (
    <div className="workflow-editor-container">
      <ReactFlowProvider>
        {/* Left side: either Nodes Library or History List */}
        {showHistory ? (
          <HistorySidebar
            onSelectHistory={handleSelectHistory}
            onClose={handleCloseHistory}
          />
        ) : (
          <Sidebar onToggleHistory={handleToggleHistory} />
        )}

        <EditorCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          setNodes={setNodes}
          setEdges={setEdges}
        />

        {/* Right side: either Node Properties or History Detail */}
        {selectedHistory ? (
          <HistoryDetailPanel
            historyItem={selectedHistory}
            onClose={handleCloseHistoryDetail}
          />
        ) : selectedNode ? (
          <PropertiesPanel
            selectedNode={selectedNode}
            updateNodeData={updateNodeData}
            deleteNode={deleteNode}
          />
        ) : null}
      </ReactFlowProvider>
    </div>
  );
};

export default WorkflowEditor;
