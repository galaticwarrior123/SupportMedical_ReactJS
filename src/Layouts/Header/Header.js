import './Header.css';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationPopup from '../../Components/NotificationsPopup/NotificationPopup';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../../redux/slices/notificationSlice';
import { getUnreadCount } from '../../redux/slices/chatSlice';


const Header = () => {
    const dispatch = useDispatch();
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [isMobileView, setMobileView] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    // unread notification count
    const { unreadCount } = useSelector((state) => state.notification);
    const { unreadChatCount } = useSelector((state) => state.chat);

    const navigate = useNavigate();
    const location = useLocation();

    const user = JSON.parse(localStorage.getItem('user'));

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const handleResize = () => {
        if (window.innerWidth <= 768) {
            setMobileView(true);
        } else {
            setMobileView(false);
        }
    };
    const handleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }
    const handleDirectLogin = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('roles');
        navigate('/login');
    }
    const handleDirectProfile = () => {
        navigate('/forum/profile/' + user._id);
    }
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize(); // Check initial screen size

        dispatch(fetchNotifications());
        dispatch(getUnreadCount());
        console.log('header', unreadCount);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [dispatch]);
    const renderDropdown = () => {
        if (isDropdownOpen) {
            return (
                <div className="header-avatar-dropdown">
                    <div className="header-avatar-dropdown-info">
                        <img src={JSON.parse(localStorage.getItem('user')).avatar} alt="avatar" />
                        <div>
                            <p>{user.firstName} {user.lastName}</p>
                        </div>
                    </div>
                    <ul>
                        <li><button onClick={handleDirectProfile}>Trang cá nhân</button></li>
                        <li><button onClick={handleDirectLogin}>
                            Đăng xuất
                        </button> </li>

                    </ul>
                </div>
            );
        }
        return null;
    }

    const handleNavigate = (path) => {
        navigate(path);
    };

    const isActive = (path, exact = true) => {
        if (exact) {
            return location.pathname === path;
        } else {
            return location.pathname.includes(path);
        }
    };

    const handleClickLogo = () => {
        if (isMobileView) {
            return toggleMenu;
        }
        return () => handleNavigate('/forum');
    };

    const toggleNotification = () => {
        setIsNotificationOpen(!isNotificationOpen);
    };

    return (
        <div className="header">
            <div className="header-container">
                {
                    isNotificationOpen && (
                        <NotificationPopup />
                    )
                }
                <div className="header-logo">
                    <img src={isMobileView ? "/images/menu.png" : "/images/Logo.png"} alt="logo"
                        onClick={isMobileView ? toggleMenu : handleClickLogo()} />
                </div>

                <div className={`header-nav-action-item ${isMenuOpen ? 'open' : ''}`}>
                    <ul>
                        <li onClick={() => handleNavigate('/forum')} className={isActive('/forum') ? 'active-button' : ''}><img src="/images/home.png" alt="home" /></li>
                        <li 
                            onClick={() => handleNavigate('/forum/chat')} 
                            className={isActive('/forum/chat', false) ? 'active-button' : ''}>
                                <img src="/images/rocketchat.png" alt="rocketchat" />
                                {unreadChatCount > 0 && (
                                    <span className="badge">{unreadChatCount}</span>
                                )}
                        </li>
                        <li onClick={() => handleNavigate('/forum/appointment')} className={isActive('/forum/appointment', false) ? 'active-button' : ''}><img src="/images/calendar-alt.png" alt="calendar-alt" /></li>
                        <li onClick={() => handleNavigate('/forum/search')} className={isActive('/forum/search') ? 'active-button' : ''}><img src="/images/search.png" alt="search" /></li>
                        {
                            user.roles.includes('DOCTOR') && (
                                //<li onClick={() => handleNavigate('/permission')} className={isActive('/permission') ? 'active-button' : ''}><img src="/images/permission.png" alt="permission" style={{width:30, height:30}} /></li>
                                <li onClick={() => handleNavigate('/forum/permission')} className={isActive('/forum/permission') ? 'active-button' : ''}><img src="/images/permission.png" alt="search" style={{padding:5,width:30, height:30}} /></li>
                            )
                        }
                    </ul>
                </div>

                <div className="header-avatar">
                    <div
                        onClick={() => toggleNotification()}
                        className={`noti-icon ${isNotificationOpen ? 'active-button' : ''}`}
                    >
                        <img src="/images/bell.png" alt="bell" />
                        {unreadCount > 0 && (
                            <span className="badge">{unreadCount}</span>
                        )}
                    </div>
                    <img src={JSON.parse(localStorage.getItem('user')).avatar} alt="avatar"
                        onClick={handleDropdown} />
                    {renderDropdown()}
                </div>
            </div>

        </div>
    );
}

export default Header;  