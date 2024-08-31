import { formatMessageTime } from '../../../../Common/DatetimeUtils';
import './ChatItem.css';

const ChatItem = ({ item, onClick }) => {
    let friend = null;
    if (!item.isGroup) {
        const userId = JSON.parse(localStorage.getItem('user'))._id;
        friend = item.participants.find(participant => participant._id !== userId);
    }

    return (
            <div onClick={onClick} className="chat-item">
                <div className="chat-item-avatar">
                    <img src={friend.avatar} alt="avatar" />
                </div>
                <div className="chat-item-content">
                    <div className="chat-item-content-title">
                        <span>{friend.firstName} {friend.lastName}</span>
                    </div>
                    <div className="chat-item-content-last-message">
                        <span>{item.lastMessage.content}</span>
                        <span className="chat-item-content-time">{" · " + formatMessageTime(item.lastMessage.createdAt)}
                        </span>
                    </div>
                </div>
            </div>
    )
}

export default ChatItem;