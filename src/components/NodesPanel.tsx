import React from 'react';

const NodesPanel = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="nodes-panel">
      <div className="panel-title">Nodes Panel</div>
      <div
        className="dnd-node"
        onDragStart={(event) => onDragStart(event, 'textMessage')}
        draggable
      >
        <span role="img" aria-label="message icon">💬</span> Message
      </div>
      {/* To add more nodes, simply add another div like the one above */}
    </aside>
  );
};

export default NodesPanel;