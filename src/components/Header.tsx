import React from 'react';

interface HeaderProps {
  onSave: () => void;
  status: 'success' | 'error' | null;
}

const Header: React.FC<HeaderProps> = ({ onSave, status }) => {
  return (
    <header className="app-header">
      {status === 'error' && (
        <div className="notification error">Cannot save Flow</div>
      )}
      {status === 'success' && (
        <div className="notification success">Flow Saved!</div>
      )}
      <button className="save-button" onClick={onSave}>
        Save Changes
      </button>
    </header>
  );
};

export default Header;