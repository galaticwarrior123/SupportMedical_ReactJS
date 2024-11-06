import { MessageType } from '../../../../API/ChatAPI';
import { formatMessageTime } from '../../../../Common/DatetimeUtils';
import './ChatItem.css';

const ChatItem = ({ item, onClick, isActive }) => {
    let friend = null;
    if (!item.isGroup) {
        const userId = JSON.parse(localStorage.getItem('user'))._id;
        friend = item.participants.find(participant => participant._id !== userId);
    }

    return (
            <div onClick={onClick} className={`chat-item ${item.isRead ? '' : 'unread'} ${isActive ? 'active' : ''}`}>
                <div className="chat-item-avatar">
                    <img src={friend.avatar} alt="avatar" />
                </div>
                <div className="chat-item-content">
                    <div className="chat-item-content-title">
                        <span>{friend.firstName} {friend.lastName}</span>
                    </div>
                    <div className="chat-item-content-last-message">
                        {item.lastMessage.type === MessageType.TEXT && <span className="chat-item-content-type">{item.lastMessage.content}</span>}
                        {item.lastMessage.type === MessageType.IMAGE && <span className="chat-item-content-type">{"🖼️"}</span>}
                        {item.lastMessage.type === MessageType.APPOINTMENT && <span className="chat-item-content-type">{"📅"}</span>}
                        <span className="chat-item-content-time">{" · " + formatMessageTime(item.lastMessage.createdAt)}
                        </span>
                    </div>
                </div>
            </div>
    )
}

export default ChatItem;