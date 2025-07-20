import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Node,
  Edge,
  Connection,
  ReactFlowInstance,
  OnSelectionChangeParams,
} from 'reactflow';
import 'reactflow/dist/style.css';

import NodesPanel from './NodesPanel';
import SettingsPanel from './SettingsPanel';
import Header from './Header';
import TextMessageNode from './TextMessageNode';

// Initial nodes for demonstration
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'textMessage',
    data: { label: 'test message 1' },
    position: { x: 250, y: 5 },
  },
];

let id = 2; // Initial ID for new nodes
const getNextId = () => `node_${id++}`;

// Register custom node types
const nodeTypes = {
  textMessage: TextMessageNode,
};

const FlowBuilder = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);

  /**
   * Handles connecting two nodes.
   * Ensures that a source handle can only have one outgoing edge.
   */
  const onConnect = useCallback(
    (params: Connection) => {
      // Check if the source handle is already connected
      const sourceHandleIsAlreadyConnected = edges.some(
        (edge) => edge.source === params.source
      );
      if (!sourceHandleIsAlreadyConnected) {
        setEdges((eds) => addEdge(params, eds));
      } else {
        // You could show a notification here if needed
        console.warn("Source handle already connected.");
      }
    },
    [edges, setEdges]
  );

  /**
   * Handles the drag-over event to allow dropping.
   */
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  /**
   * Handles dropping a new node from the panel onto the flow canvas.
   */
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // Check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: getNextId(),
        type,
        position,
        data: { label: `text message ${id -1}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  /**
   * Updates the data of a specific node (e.g., when text is changed in settings).
   */
  const updateNodeData = (nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      )
    );
    // Also update the selected node state if it's the one being edited
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(prev => prev ? {...prev, data: {...prev.data, ...data}} : null);
    }
  };

  /**
   * Tracks node selection to toggle between Nodes and Settings panels.
   */
  const onSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    if (params.nodes.length > 0) {
      // A node is selected, find it and set it as selectedNode
      const selected = nodes.find(node => node.id === params.nodes[0].id);
      setSelectedNode(selected || null);
    } else {
      // No node is selected, clear the selection
      setSelectedNode(null);
    }
  }, [nodes]);

  /**
   * Clears the selected node, switching back to the Nodes Panel.
   */
  const clearSelection = () => {
    // React Flow's internal state needs to be updated to remove selection highlight
    onNodesChange([{ type: 'select', id: selectedNode?.id || '', selected: false }]);
    setSelectedNode(null);
  };
  
  /**
   * Handles the save logic, including validation.
   */
  const onSave = () => {
    // Condition: More than one node and more than one has an empty target handle (is a terminal node)
    if (nodes.length > 1) {
        const sourceNodeIds = new Set(edges.map(edge => edge.source));
        const nodesWithEmptyTargets = nodes.filter(node => !sourceNodeIds.has(node.id));

        if (nodesWithEmptyTargets.length > 1) {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(null), 3000); // Hide message after 3 seconds
            return;
        }
    }
    
    // If validation passes
    setSaveStatus('success');
    console.log("Flow saved successfully!", { nodes, edges });
    setTimeout(() => setSaveStatus(null), 3000); // Hide message after 3 seconds
  };


  return (
    <div className="flow-builder-container">
      <Header onSave={onSave} status={saveStatus}/>
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onSelectionChange={onSelectionChange}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        <div className="sidebar">
          {selectedNode ? (
            <SettingsPanel
              node={selectedNode}
              updateNode={updateNodeData}
              onBack={clearSelection}
            />
          ) : (
            <NodesPanel />
          )}
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default FlowBuilder;