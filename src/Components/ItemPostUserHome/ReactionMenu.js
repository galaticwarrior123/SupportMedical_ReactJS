import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faHeart, faSurprise } from '@fortawesome/free-solid-svg-icons';
import './ReactionMenu.css';


const ReactionMenu = ({ onReactionSelect, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);
    const menuRef = useRef(null);
    let timeoutId = useRef(null);

    

    const reactions = [
        { id: 'like', icon: faThumbsUp, color: 'blue', textColor: 'blue' },
        { id: 'love', icon: faHeart, color: 'red', textColor: 'red' },
        { id: 'surprise', icon: faSurprise, color: 'orange', textColor: 'orange' },
    ];

    return (
        <div
            className={`reaction-menu ${isVisible ? 'show' : ''}`}
            ref={menuRef}
        >
            {reactions.map((reaction) => (
                <button
                    key={reaction.id}
                    className="reaction-button"
                    onClick={() => onReactionSelect(reaction.id)}
                    style={{ color: reaction.textColor }} // Add text color here
                >
                    <FontAwesomeIcon icon={reaction.icon} style={{ color: reaction.color, marginRight: '2' }} />
                </button>
            ))}
        </div>
    );
};

export default ReactionMenu;