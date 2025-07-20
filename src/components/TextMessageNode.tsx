import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

// Define the shape of the data object for our custom node
interface TextMessageData {
  label: string;
}

const TextMessageNode: React.FC<NodeProps<TextMessageData>> = ({ data }) => {
  return (
    <div className="text-message-node">
      {/* Target handle on the left for incoming connections */}
      <Handle type="target" position={Position.Left} />
      
      <div className="node-header">
        <span role="img" aria-label="message icon">💬</span> Send Message
      </div>
      <div className="node-body">
        {data.label || 'Enter message text...'}
      </div>
      
      {/* Source handle on the right for outgoing connections */}
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default TextMessageNode;