import ChatItem from './ChatItem/ChatItem';
import DefaultLayout from '../../../Layouts/DefaultLayout/DefaultLayout';
import './Chat.css';
import { useEffect, useState, useRef } from 'react';
import { socket } from '../../../API/Socket';
import MessageItem from './MessageItem/MessageItem';
import { AppointmentStatus, ChatAPI, MessageType } from '../../../API/ChatAPI';
import { UserAPI } from '../../../API/UserAPI';
import SearchItem from './ChatItem/SearchItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faImage, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import imageCompression from 'browser-image-compression';
import CreateApptFormModal from './CreateApptFormModal/CreateApptFormModal';

const Chat = () => {
    const messageEndRef = useRef(null);
    const textAreaRef = useRef(null);

    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const [search, setSearch] = useState('');
    const [debounceSearch, setDebounceSearch] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    const [showCreateApptFormModal, setShowCreateApptFormModal] = useState(false);


    const user = JSON.parse(localStorage.getItem('user'));
    var otherUser = selectedChat?.participants.find((participant) => participant._id !== user._id);

    // get list chat on mount
    useEffect(() => {
        async function getChats() {
            const response = await ChatAPI.getChats();
            if (response.data) {
                setChats(response.data);
                setSelectedChat(response.data[0]);
            }

        }
        getChats();
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

    // listen for new messages or updated messages
    useEffect(() => {
        socket.on('receive-message', async (message) => {
            if (message.chat === selectedChat?._id) {
                const newMessages = [message, ...messages];
                setMessages(newMessages);
            }
            // get the new chat and put it on top, remove the old one if exists
            const newChat = (await ChatAPI.getChatById(message.chat)).data;
            console.log(newChat);
            const newChats = [newChat, ...chats.filter((chat) => chat._id !== message.chat)];
            setChats(newChats);
        });
        // scroll to bottom
        messageEndRef.current.scrollIntoView({ behavior: "smooth" });

        socket.on('update-message', async (message) => {
            if (message.chat === selectedChat?._id) {
                const newMessages = messages.map((msg) => {
                    if (msg._id === message._id) {
                        return message;
                    }
                    return msg;
                });
                setMessages(newMessages);
            }
        });

        return () => {
            socket.off('receive-message');
            socket.off('update-message');
        }
    }, [messages, selectedChat, chats]);

    // debounce search for performance
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceSearch(search);
        }, 500);

        return () => {
            clearTimeout(timer);
        }
    }, [search]);

    // search for user by email
    useEffect(() => {
        if (debounceSearch) {
            UserAPI.findUserByEmail(debounceSearch).then((response) => {
                setSearchResult(response.data);
            });
        } else {
            setSearchResult(null);
        }
    }, [debounceSearch]);


    const handleSendMessage = () => {
        if (newMessage.trim()) {
            socket.emit('send-message', {
                chat: selectedChat._id,
                content: newMessage.trim(),
                type: MessageType.TEXT,
            });
        }
        setNewMessage('');
        textAreaRef.current.style.height = 'auto'; // reset height
    }

    const handleNewMessageChange = (e) => {
        setNewMessage(e.target.value);
        // auto resize text area
        const tArea = textAreaRef.current;
        tArea.style.height = 'auto';
        tArea.style.height = tArea.scrollHeight + 'px';
    }

    const handleSearchItemClicked = async (item) => {
        // find chat by participants
        const response = await ChatAPI.getPrivateChat(item._id);
        console.log(response);
        if (response.data) {
            setSelectedChat(response.data);
        } else {
            setMessages([]);
            setSelectedChat(null);
        }
    }

    const handleChatItemClicked = (item) => {
        setSelectedChat(item);
    }

    const handleSendImage = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = async (e) => {
            const files = Object.values(e.target.files);
            console.log(files);
            const compressedFiles = await Promise.all(files.map(async (file) => {
                return await imageCompression(file, {
                    maxSizeMB: 2,
                    maxWidthOrHeight: 1080,
                    useWebWorker: true,
                });
            }));
            socket.emit('send-message', {
                chat: selectedChat._id,
                content: compressedFiles,
                type: MessageType.IMAGE,
            });
        }
        input.click();
    }

    const handleSendAppt = (appt) => {
        socket.emit('send-message', {
            chat: selectedChat._id,
            content: appt,
            type: MessageType.APPOINTMENT,
        });
        setShowCreateApptFormModal(false);
    };

    const handleAcceptApt = (e, messageId) => {
        e.stopPropagation();
        socket.emit('update-appt-message-status', {
            messageId,
            status: AppointmentStatus.ACCEPTED,
        });
    }

    return (
        <DefaultLayout>
            <div className="chat-page">
            <CreateApptFormModal 
                handleSendAppt={handleSendAppt}
                show={showCreateApptFormModal} 
                handleClose={ () => setShowCreateApptFormModal(false)} 
            />
                <div className="card chat-list-card">
                    <div className="card-title">
                        <span>Cuộc trò chuyện</span>
                    </div>
                    <div className="search-chat">
                        <input
                            onChange={
                                (e) => setSearch(e.target.value)
                            }
                            value={search} className="search-chat"
                            type="text" placeholder="Tìm kiếm..." />
                    </div>

                    <div className="chat-list">
                        {searchResult && searchResult.length > 0 ?
                            searchResult.map((friend) => (
                                <SearchItem onClick={
                                    () => handleSearchItemClicked(friend)
                                } key={friend._id} item={friend} />
                            ))
                            : (search ? 'Không tìm thấy kết quả nào.' : chats.map((chat) => (
                                <ChatItem onClick={
                                    () => handleChatItemClicked(chat)
                                } key={chat._id} item={chat} />
                            )))
                        }
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
                            {
                                !messages.length && (
                                    <div className="no-message">
                                        <span>Không có tin nhắn nào</span>
                                    </div>
                                )
                            }
                            {
                                messages?.map((message) => (
                                    <MessageItem 
                                        onAcceptApt={handleAcceptApt}
                                        key={message._id} message={message} />
                                ))
                            }

                        </div>

                    </div>

                    <div className="chat-footer">
                        <button onClick={handleSendImage} className="btn-attachment">
                            <FontAwesomeIcon icon={faImage} />
                        </button>
                        <button onClick={() => setShowCreateApptFormModal(true)} className="btn-attachment">
                            <FontAwesomeIcon icon={faCalendarDays} />
                        </button>
                        <div className="message-input">
                            <textarea
                                ref={textAreaRef}
                                onChange={handleNewMessageChange}
                                rows="1"
                                value={newMessage} type="text" placeholder="Nhập tin nhắn..."
                                onKeyDown={(e) => {
                                    // send message on enter
                                    if (e.key === 'Enter') {
                                        if (!e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }
                                }}
                            />
                        </div>
                        <button className="btn-send" onClick={handleSendMessage}>
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default Chat;