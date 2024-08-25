import './Header.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileView, setMobileView] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

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
        navigate('/profile');
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
                        <img src="/images/Avatar.png" alt="avatar" />
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



    return (
        <div className="header">
            <div className="header-container">
                <div className="header-logo">
                    <img src={isMobileView ? "/images/Menu.png" : "/images/Logo.png"} alt="logo"
                        onClick={isMobileView ? toggleMenu : null} />
                </div>

                <div className={`header-nav-action-item ${isMenuOpen ? 'open' : ''}`}>
                    <ul>
                        <li><img src="/images/home.png" alt="home" /></li>
                        <li><img src="/images/rocketchat.png" alt="rocketchat" /></li>
                        <li><img src="/images/calendar-alt.png" alt="calendar-alt" /></li>
                        <li><img src="/images/search.png" alt="search" /></li>
                        <li><img src="/images/bell.png" alt="bell" /></li>
                    </ul>
                </div>

                <div className="header-avatar">
                    <img src="/images/Avatar.png" alt="avatar"
                        onClick={handleDropdown} />
                    {renderDropdown()}
                </div>
            </div>

        </div>
    );
}

export default Header;  