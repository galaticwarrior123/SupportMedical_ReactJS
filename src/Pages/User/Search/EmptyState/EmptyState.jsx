import React from 'react';
import './EmptyState.css';

const EmptyState = () => {
  return (
    <div className="empty-state-container">
      <div className="empty-state-icon">🔍</div>
      <p className="empty-state-text">Tìm người khác, bài viết, ...</p>
    </div>
  );
};

export default EmptyState;
