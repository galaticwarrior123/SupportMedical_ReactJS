import { useState } from 'react';
import { MessageType } from '../../../../API/ChatAPI';
import { formatFullDatetime, formatMessageTime } from '../../../../Common/DatetimeUtils';
import './MessageItem.css';

const MessageItem = ({ message }) => {
    const [showDate, setShowDate] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const byUser = message.sender === user._id;

    return (
        <div className={'message-item' + (byUser ? ' message-item-right' : '')}>
            {
                byUser ||
                <div className="message-item-avatar">
                    <img src="https://via.placeholder.com/150" alt="avatar" />
                </div>
            }
            {
                message.type === MessageType.TEXT && (
                    <>
                        <div onClick={
                            () => setShowDate(!showDate)
                        } className="message-item-content">
                            <div className="message-item-content-text">
                                <pre>{message.content}</pre>
                            </div>
                            <div className="message-item-date">
                                <span>{showDate ? formatFullDatetime(message.createdAt) : ''}</span>
                            </div>
                        </div>


                    </>
                )
            }
            {
                message.type === MessageType.IMAGE && (
                    <div className="message-item-content">
                        {message.content.length === 1 && (
                            <div className="message-item-content-image">
                                <img src={message.content[0]} alt="image" />
                            </div>
                        )}
                        {message.content.length === 2 && (
                            <div className="message-item-content-images">
                                <div className="message-item-content-image half-width">
                                    <img src={message.content[0]} alt="image" />
                                </div>
                                <div className="message-item-content-image half-width">
                                    <img src={message.content[1]} alt="image" />
                                </div>
                            </div>
                        )}
                        {message.content.length === 3 && (
                            <div className="message-item-content-images">
                                <div className="message-item-content-image half-width">
                                    <img src={message.content[0]} alt="image" />
                                </div>
                                <div className="message-item-content-image half-width">
                                    <img src={message.content[1]} alt="image" />
                                </div>
                                <div className="message-item-content-image">
                                    <img src={message.content[2]} alt="image" />
                                </div>
                            </div>
                        )}
                        {message.content.length > 3 && (
                            <div className="message-item-content-images">
                                <div className="message-item-content-image half-width">
                                    <img src={message.content[0]} alt="image" />
                                </div>
                                <div className="message-item-content-image half-width">
                                    <img src={message.content[1]} alt="image" />
                                </div>
                                <div className="message-item-content-image">
                                    <img src={message.content[2]} alt="image" />
                                </div>
                                <div className="message-item-content-image">
                                    <span>+{message.content.length - 3} ảnh khác</span>
                                </div>
                            </div>
                        )}

                    </div>
                )
            }

        </div>
    )
}

export default MessageItem;