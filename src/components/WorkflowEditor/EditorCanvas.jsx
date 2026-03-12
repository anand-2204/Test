import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  reconnectEdge,
  BackgroundVariant,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import CustomNode from './CustomNode';
import './WorkflowEditor.css';

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

  const onReconnect = useCallback((oldEdge, newConnection) => {
    edgeReconnectSuccessful.current = true;
    setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
  }, [setEdges]);

  const onReconnectEnd = useCallback((_, edge) => {
    if (!edgeReconnectSuccessful.current) {
      setEdges((els) => els.filter((e) => e.id !== edge.id));
    }
    edgeReconnectSuccessful.current = true;
  }, [setEdges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const nodeDataRaw = event.dataTransfer.getData('application/reactflow');

      if (!nodeDataRaw) {
        return;
      }

      const nodeData = JSON.parse(nodeDataRaw);

      // Use the provided screenToFlowPosition hook to get perfectly accurate coordinates 
      // considering the current zoom and pan level
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Shift the initial position slightly so the drop target is near the center of the node, 
      // rather than the top-left corner. Nodes are approx 220px wide and 80px high
      position.x -= 110; 
      position.y -= 40;

      const newNode = {
        id: uuidv4(),
        type: nodeData.type === 'task' ? 'customTask' : 'customAction',
        position,
        data: {
          ...nodeData,
          originalId: nodeData.id
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
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
        <Background gap={16} size={1} color="#000" variant={"dots"} />
        <Controls />
        {/* <MiniMap nodeStrokeColor="#ccc" nodeColor="#fff" /> */}
      </ReactFlow>
    </div>
  );
};

export default EditorCanvas;
