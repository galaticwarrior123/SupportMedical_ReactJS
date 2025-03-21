import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './HeaderRegisterMedicalMedicalExaminationPage.css';
import { faBell, faNotesMedical, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const notifications = [
    { id: 1, content: "Bạn có lịch hẹn khám mới từ Nguyễn Văn A", createAt: "2021-10-10", isRead: false },
    { id: 2, content: "Hồ sơ của bạn đã được cập nhật", createAt: "2021-10-10", isRead: true },
    { id: 3, content: "Bạn có tin nhắn mới từ bác sĩ", createAt: "2021-10-10", isRead: false },
];

const HeaderRegisterMedicalExaminationPage = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showBellDropdown, setShowBellDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const bellDropdownRef = useRef(null);
    const navigate = useNavigate();

    const unreadNotifications = notifications.filter(notification => !notification.isRead).length;

    // Đóng dropdown nếu click bên ngoài
    useEffect(() => {
        const checkIfClickedOutside = e => {
            if (showDropdown && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
            if (bellDropdownRef.current && !bellDropdownRef.current.contains(e.target)) {
                setShowBellDropdown(false);
            }
        }

        document.addEventListener("mousedown", checkIfClickedOutside);

        return () => {
            document.removeEventListener("mousedown", checkIfClickedOutside);

        }
    }, [showDropdown, showBellDropdown]);


    const handleNavigate = (path) => {
        navigate(path);
        setShowDropdown(false);
    }


    return (
        <div className="header-register-medical-examination-page" >
            <div className="logo" onClick={() => handleNavigate('/')}>
                <img src="/images/Logo.png" alt="logo" />
            </div>
            <div className="user-info" ref={dropdownRef} >
                <div className="notification-bell" ref={bellDropdownRef}>
                    <div className="notification-icon-wrapper">
                        <FontAwesomeIcon
                            icon={faBell}
                            className="icon-bell"
                            onClick={() => setShowBellDropdown(!showBellDropdown)}
                        />
                        {unreadNotifications > 0 && (
                            <div className="notification-count">{unreadNotifications}</div>
                        )}
                    </div>

                    {showBellDropdown && (
                        <div className="bell-dropdown">
                            {notifications.length > 0 ?
                                <>
                                    {notifications.map(notification => (
                                        <div
                                            key={notification.id}
                                            className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                                        >
                                            {notification.content}
                                        </div>

                                    ))}

                                    <div className="notification-bell-footer">
                                        <button className="view-all-notification" onClick={() => handleNavigate('/notifications')}>
                                            Xem tất cả thông báo
                                        </button>
                                    </div>
                                </> : <p>Không có thông báo mới</p>}
                        </div>
                    )}
                </div>


                <button className="user-button" onClick={() => setShowDropdown(!showDropdown)}>
                    <img src="/images/Avatar.png" alt="user" />
                    <span>Nguyễn Văn A</span>
                </button>

                {showDropdown && (
                    <div className="dropdown-menu " >
                        <div className="dropdown-header">
                            <img src="/images/Avatar.png" alt="user" />
                            <p>Xin chào, <b>Nguyễn Văn A</b></p>

                        </div>
                        <ul>
                            <li onClick={() => handleNavigate('/manage-records')}>
                                <FontAwesomeIcon icon={faUser} /> Hồ sơ bệnh nhân
                            </li>
                            <li onClick={() => handleNavigate('/notifications')}>
                                <FontAwesomeIcon icon={faNotesMedical} /> Thông báo
                            </li>
                            <li className="logout" onClick={() => handleNavigate('/login')}
                            ><FontAwesomeIcon icon={faSignOutAlt} /> Đăng xuất</li>
                        </ul>
                    </div>
                )}
            </div>

        </div>
    );
}
export default HeaderRegisterMedicalExaminationPage;
