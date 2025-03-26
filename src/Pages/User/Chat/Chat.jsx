import ChatItem from './ChatItem/ChatItem';
import DefaultLayout from '../../../Layouts/DefaultLayout/DefaultLayout';
import './Chat.css';
import { useEffect, useState, useRef } from 'react';
import MessageItem from './MessageItem/MessageItem';
import { AppointmentStatus, ChatAPI, MessageType } from '../../../API/ChatAPI';
import { UserAPI } from '../../../API/UserAPI';
import SearchItem from './ChatItem/SearchItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faCircleInfo, faImage, faPaperPlane, faVideo } from '@fortawesome/free-solid-svg-icons';
import imageCompression from 'browser-image-compression';
import CreateApptFormModal from './CreateApptFormModal/CreateApptFormModal';
import { useSocket } from '../../../context/SocketProvider';
import ReactLoading from 'react-loading';
import { useNavigate, useParams } from 'react-router-dom';

const Chat = () => {
    const navigate = useNavigate();
    const socket = useSocket();
    const messageEndRef = useRef(null);
    const textAreaRef = useRef(null);

    const [chats, setChats] = useState([]);
    const { id } = useParams();
    const [selectedChat, setSelectedChat] = useState();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const [search, setSearch] = useState('');
    const [debounceSearch, setDebounceSearch] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    const [showCreateApptFormModal, setShowCreateApptFormModal] = useState(false);

    const messageListRef = useRef(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const LIMIT = 20;


    const user = JSON.parse(localStorage.getItem('user'));
    const otherUser = selectedChat?.participants.find((participant) => participant._id !== user._id);

    // get list chat on mount
    useEffect(() => {
        async function getChats() {
            const response = await ChatAPI.getChats();
            if (response.data.length > 0) {
                setChats(response.data);
                // setSelectedChat(response.data[0]);
                if (!id)
                    navigate(`/forum/chat/${response.data[0]._id}`);
            }
        }
        getChats();
    }, []);

    useEffect(() => {
        async function getChatById() {
            const response = await ChatAPI.getChatById(id);
            if (response.data) {
                setSelectedChat(response.data);
            } else {
                navigate('/forum/chat');
            }
        }
        if (id) {
            // reinitialize messages
            setMessages([]);
            setPage(1);
            setHasMore(true);
            getChatById();
        }
    }, [id]);

    const getMessages = async () => {
        if (!selectedChat) return;
        setLoading(true);
        try {
            const currentScrollHeight = messageListRef.current.scrollHeight;
            const response = await ChatAPI.getMessagesPagination(selectedChat._id, page, LIMIT);
            // filter out messages that are already in the list
            const newMessages = response.data.filter((msg) => !messages.find((m) => m._id === msg._id));
            setMessages([...messages, ...newMessages]);
            if (page === 1) {
                // use setTimeout to wait for the DOM to update
                setTimeout(() => {
                    scrollToBottom();
                }, 0);
            } else {
                const newScrollHeight = messageListRef.current.scrollHeight;
                messageListRef.current.scrollTop = newScrollHeight - currentScrollHeight;
            }
            if (response.data.length < LIMIT) {
                setHasMore(false);
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    // get messages of selected chat
    useEffect(() => {
        getMessages();

    }, [selectedChat, page]);

    // mark chat as read
    useEffect(() => {
        async function markChatAsRead() {
            if (selectedChat && !selectedChat.isRead) {
                await ChatAPI.markChatAsRead(selectedChat._id);
                // update chat list
                const newChats = chats.map((chat) => {
                    if (chat._id === selectedChat._id) {
                        return { ...chat, isRead: true };
                    }
                    return chat;
                });
                setChats(newChats);
            }
        }
        markChatAsRead();
    }, [selectedChat]);

    const handleLoadMore = () => {
        if (hasMore && !loading) {
            setPage(prevPage => prevPage + 1);
        }
    }

    const handleScroll = () => {
        const messageList = messageListRef.current;
        if (messageList.scrollTop === 0) {
            handleLoadMore();
        }
    }
    const scrollToBottom = () => {
        messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

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

            // scroll to bottom
            scrollToBottom();
        });


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
    }, [messages, selectedChat, chats, socket]);

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
            UserAPI.searchUser(debounceSearch).then((response) => {
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
        if (response.data) {
            navigate(`/forum/chat/${response.data._id}`);
        } else {
            setMessages([]);
            setSelectedChat(null);
        }
    }

    const handleChatItemClicked = (item) => {
        if (item._id !== selectedChat._id) {
            navigate(`/forum/chat/${item._id}`);
        }
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
                    handleClose={() => setShowCreateApptFormModal(false)}
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
                            : (search ? 'Không tìm thấy kết quả nào.'
                                : chats.map((chat) => {
                                    const isActive = selectedChat?._id === chat._id;
                                    return (
                                        <ChatItem
                                            onClick={
                                                () => handleChatItemClicked(chat)
                                            }
                                            key={chat._id} item={chat}
                                            isActive={isActive}
                                        />
                                    )
                                }
                                ))
                        }
                    </div>
                </div>

                <div className="card chat-box">
                    <div className="chat-header">
                        <div onClick={() => navigate(`/forum/profile/${otherUser._id}`)} className="chat-header-left">
                            <div className="chat-header-avatar">
                                <img src={otherUser?.avatar} alt="avatar" />
                            </div>
                            <div className="chat-header-content">
                                <div className="chat-header-content-title">
                                    <span>{otherUser?.firstName} {otherUser?.lastName}</span>
                                    {
                                        otherUser?.roles && otherUser?.roles.includes('DOCTOR') && (
                                            <span className="user-doctor-badge">
                                                <span className="doctor-icon">✔️</span> Bác sĩ
                                            </span>
                                        )
                                    }
                                </div>
                                {/* <div className="chat-header-content-status">
                                    <span>Đang hoạt động</span>
                                </div> */}
                            </div>
                        </div>

                        <div className="chat-header-right">
                            <button
                                onClick={() => {
                                    const callWindow = window.open(`/call/${otherUser._id}`, 'VideoCallWindow', 'width=800,height=600');
                                }}
                                className="btn-attachment">
                                <FontAwesomeIcon icon={faVideo} />
                            </button>
                            <button className="btn-attachment">
                                <FontAwesomeIcon icon={faCircleInfo} />
                            </button>

                        </div>
                    </div>

                    <div onScroll={handleScroll} ref={messageListRef} className="chat-body">
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
                            {loading &&
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <ReactLoading type="spin" color="#007bff" height={40} width={40} />
                                </div>}

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