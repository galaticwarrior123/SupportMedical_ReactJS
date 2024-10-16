import './Header.css';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationPopup from '../../Components/NotificationsPopup/NotificationPopup';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [isMobileView, setMobileView] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

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
        navigate('/profile/' + user._id);
    }
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize(); // Check initial screen size

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
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

    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleClickLogo = () => {
        if (isMobileView) {
            return toggleMenu;
        }
        return () => handleNavigate('/');
    };

    const toggleNotification = () => {
        setIsNotificationOpen(!isNotificationOpen);
    }

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
                        <li onClick={() => handleNavigate('/')} className={isActive('/') ? 'active-button' : ''}><img src="/images/home.png" alt="home" /></li>
                        <li onClick={() => handleNavigate('/chat')} className={isActive('/chat') ? 'active-button' : ''}><img src="/images/rocketchat.png" alt="rocketchat" /></li>
                        <li onClick={() => handleNavigate('/appointment')} className={isActive('/appointment') ? 'active-button' : ''}><img src="/images/calendar-alt.png" alt="calendar-alt" /></li>
                        <li onClick={() => handleNavigate('/search')} className={isActive('/search') ? 'active-button' : ''}><img src="/images/search.png" alt="search" /></li>
                        {/* <li onClick={() => toggleNotification()} className={isActive('/notifications') ? 'active-button' : ''}><img src="/images/bell.png" alt="bell" /></li> */}
                    </ul>
                </div>

                <div className="header-avatar">
                    <div onClick={() => toggleNotification()} className={isNotificationOpen ? 'active-button' : ''}><img src="/images/bell.png" alt="bell" /></div>
                    <img src={JSON.parse(localStorage.getItem('user')).avatar} alt="avatar"
                        onClick={handleDropdown} />
                    {renderDropdown()}
                </div>
            </div>

        </div>
    );
}

export default Header;  