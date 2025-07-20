import React, { useState, useEffect } from 'react';
import { Node } from 'reactflow';

interface SettingsPanelProps {
  node: Node;
  updateNode: (id: string, data: any) => void;
  onBack: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ node, updateNode, onBack }) => {
  const [text, setText] = useState(node.data.label || '');

  // Update local state if a different node is selected
  useEffect(() => {
    setText(node.data.label || '');
  }, [node.id, node.data.label]);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    setText(newText);
    updateNode(node.id, { label: newText });
  };

  return (
    <aside className="settings-panel">
      <div className="panel-header">
        <button className="back-button" onClick={onBack}>←</button>
        <div className="panel-title">Message</div>
      </div>
      <div className="panel-body">
        <label htmlFor="text-input">Text</label>
        <textarea
          id="text-input"
          value={text}
          onChange={handleTextChange}
          rows={4}
        />
      </div>
    </aside>
  );
};

export default SettingsPanel;