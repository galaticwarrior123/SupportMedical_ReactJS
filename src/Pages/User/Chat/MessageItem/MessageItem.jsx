import './MessageItem.css';

const MessageItem = ({ message }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const byUser = message.sender === user._id;

    return byUser ? (
        <div className={`message-item message-item-right`}>
            <div className="message-item-content">
                <div className="message-item-content-text">
                    <pre>{message.content}</pre>
                </div>
            </div>
        </div>
    ) : (
        <div className={`message-item`}>
            <div className="message-item-avatar">
                <img src="https://via.placeholder.com/150" alt="avatar" />
            </div>
            <div className="message-item-content">
                {/* <div className="message-item-content-title">
                    <span>Nguyễn Văn A</span>
                </div> */}
                <div className="message-item-content-text">
                    <pre>{message.content}</pre>
                </div>
            </div>
        </div>
    )
}

export default MessageItem;