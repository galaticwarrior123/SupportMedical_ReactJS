import React from 'react';
import ReactLoading from 'react-loading';
import './LoadingOverlay.css';

const LoadingOverlay = () => {
    return (
        <div className="overlay">
            <ReactLoading type="spinningBubbles" color="#3498db" height={60} width={60} />
            <p>Loading...</p>
        </div>
    );
};

export default LoadingOverlay;
