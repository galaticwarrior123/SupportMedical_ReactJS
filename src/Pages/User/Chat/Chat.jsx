import ChatItem from './ChatItem/ChatItem';
import DefaultLayout from '../../../Layouts/DefaultLayout/DefaultLayout';
import './Chat.css';
import { useEffect, useState, useRef } from 'react';
import { initSocket, socket } from '../../../API/Socket';
import MessageItem from './MessageItem/MessageItem';
import { ChatAPI } from '../../../API/ChatAPI';

const Chat = () => {    
    const messageEndRef = useRef(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');


    const user = JSON.parse(localStorage.getItem('user'));
    var otherUser = selectedChat?.participants.find((participant) => participant._id !== user._id);

    // get list chat on mount
    useEffect(() => {
        socket.on('list-chats', (data) => {
            setChats(data);
            setSelectedChat(data[0]);
        });

        // Clean up
        return () => {
            socket.off('list-chats');
        }
    }, []);

    // get messages of selected chat
    useEffect(() => {
        async function getMessages() {
            if (selectedChat) {
                const response = await ChatAPI.getMessages(selectedChat._id);
                setMessages(response.data);
            }
        }
        getMessages();
        
    }, [selectedChat]);

    useEffect(() => {
        socket.on('receive-message', (message) => {
            if (message.chat === selectedChat._id) {
                const newMessages = [message, ...messages];
                setMessages(newMessages);
            }
        });
        // scroll to bottom
        messageEndRef.current.scrollIntoView({ behavior: "smooth" });

        return () => {
            socket.off('receive-message');
        }
    }, [messages, selectedChat]);


    const handleSendMessage = () => {
        socket.emit('send-message', {
            chat: selectedChat._id,
            content: newMessage,
            type: 'text'
        });
        setNewMessage('');
    }

    const handleNewMessageChange = (e) => {
        const tArea = e.target;
        setNewMessage(tArea.value);
        tArea.style.height = 'auto';
        tArea.style.height = tArea.scrollHeight + 'px';
    }

    return (
        <DefaultLayout>
            <div className="chat-page">
                <div className="card chat-list-card">
                    <div className="card-title">
                        <span>Cuộc trò chuyện</span>
                    </div>
                    <div className="search-chat">
                        <input className="search-chat" type="text" placeholder="Tìm kiếm..." />
                    </div>

                    <div className="chat-list">
                        {chats.map((chat) => (
                            <ChatItem key={chat._id} item={chat} />
                        ))}
                    </div>
                </div>

                <div className="card chat-box">
                    <div className="chat-header">
                        <div className="chat-header-left">
                            <div className="chat-header-avatar">
                                <img src="https://via.placeholder.com/150" alt="avatar" />
                            </div>
                            <div className="chat-header-content">
                                <div className="chat-header-content-title">
                                    <span>{otherUser?.firstName} {otherUser?.lastName}</span>
                                </div>
                                <div className="chat-header-content-status">
                                    <span>Đang hoạt động</span>
                                </div>
                            </div>
                        </div>

                        <div className="chat-header-right">

                        </div>
                    </div>

                    <div className="chat-body">
                        <div className="chat-body-message">
                            <div ref={messageEndRef}></div>
                            {messages?.map((message) => (
                                <MessageItem key={message._id} message={message} />
                            ))}
                            
                        </div>

                    </div>

                    <div className="chat-footer">
                        <div className="message-input">
                            <textarea 
                            onChange={handleNewMessageChange} 
                            rows="1"
                            value={newMessage} type="text" placeholder="Nhập tin nhắn..." />
                        </div>
                        <button onClick={handleSendMessage}>Gửi</button>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default Chat;