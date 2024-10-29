import React from 'react';
import './TabBar.css';
import { useDispatch } from 'react-redux';
import { setActiveTab } from '../../../../redux/slices/searchSlice';

const TabBar = ({ activeTab }) => {
    const dispatch = useDispatch();

  return (
    <div className="tab-bar-container">
      <div
        onClick={() => dispatch(setActiveTab('posts'))}
        className={`tab-bar-tab ${activeTab === 'posts' ? 'active' : ''}`}
      >
        Bài viết
      </div>
      <div
        onClick={() => dispatch(setActiveTab('people'))}
        className={`tab-bar-tab ${activeTab === 'people' ? 'active' : ''}`}
      >
        Mọi người
      </div>
    </div>
  );
};

export default TabBar;
