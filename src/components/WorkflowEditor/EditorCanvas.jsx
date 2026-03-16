import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  reconnectEdge,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import CustomNode from './CustomNode';
import '../../asset/css/WorkflowEditor.css';

const nodeTypes = {
  customTask: CustomNode,
  customAction: CustomNode
};

const EditorCanvas = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  setNodes,
  setEdges
}) => {
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  const edgeReconnectSuccessful = useRef(true);

  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect = useCallback(
    (oldEdge, newConnection) => {
      edgeReconnectSuccessful.current = true;
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    },
    [setEdges]
  );

  const onReconnectEnd = useCallback(
    (_, edge) => {
      if (!edgeReconnectSuccessful.current) {
        setEdges((els) => els.filter((e) => e.id !== edge.id));
      }
      edgeReconnectSuccessful.current = true;
    },
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const nodeDataRaw = event.dataTransfer.getData('application/reactflow');
      if (!nodeDataRaw) return;

      const nodeData = JSON.parse(nodeDataRaw);

      // Accurate coordinates considering zoom/pan
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Center the node (approx 220x80)
      const adjustedPosition = {
        x: position.x - 110,
        y: position.y - 40,
      };

      const newNode = {
        id: uuidv4(),
        type: nodeData.type === 'task' ? 'customTask' : 'customAction',
        position: adjustedPosition,
        data: {
          ...nodeData,
          originalId: nodeData.id,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes, screenToFlowPosition]
  );

  return (
    <div className="editor-canvas" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onReconnect={onReconnect}
        onReconnectStart={onReconnectStart}
        onReconnectEnd={onReconnectEnd}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode={['Backspace', 'Delete']}
      >
        <Background gap={16} size={1} color="#000" variant="dots" />
        <Controls />
        {/* Uncomment if you want a minimap */}
        {/* <MiniMap nodeStrokeColor="#ccc" nodeColor="#fff" /> */}
      </ReactFlow>
    </div>
  );
};

export default EditorCanvas;