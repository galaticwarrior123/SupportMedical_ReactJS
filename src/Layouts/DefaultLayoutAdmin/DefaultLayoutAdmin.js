import './DefaultLayoutAdmin.css';
import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import SidebarAdmin from './SidebarAdmin';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SidebarContext } from './SidebarContext';
import ShowProfileOption from './ShowProfileOption';
import { ToastContainer } from 'react-toastify';

const DefaultLayoutAdmin = ({ children }) => {
    const location = useLocation();
    const {isCollapsed} = useContext(SidebarContext);
    const [activeMenu, setActiveMenu] = useState('Quản lý khoa');
    const [showProfile, setShowProfile] = useState(false);

    const handleShowProfile = () => {
        setShowProfile(!showProfile);
    }
    // Map paths to menu names
    const menuNames = {
        '/admin/categories': 'Quản lý khoa',
        '/admin/doctors': 'Quản lý bác sĩ',
        '/admin/dashboard': 'Thống kê',
        '/admin/manage-schedule': 'Quản lý lịch làm việc',
        '/admin/assign-shifts': 'Phân công ca trực',
        '/admin/shift-segment': 'Quản lý khung giờ',
        '/admin/medExamService': 'Quản lý dịch vụ khám',
        '/admin/shift-change': 'Thay đổi ca trực',
        // Add more paths and their corresponding names as needed
    };

    // Update activeMenu based on the current path
    useEffect(() => {
        const currentPath = location.pathname;
        setActiveMenu(menuNames[currentPath] || 'Quản lý khoa'); // Default to 'Quản lý danh mục' if path is unknown
    }, [location.pathname]);

    return (
        <div className={`adminContainer ${isCollapsed ? 'collapsed' : ''}`}>
            <ToastContainer />
            <SidebarAdmin 
                onMenuClick={setActiveMenu} 
                activeMenu={activeMenu} 
            />
            <main className="mainContentAdmin">
                <header className="headerAdmin">
                    <div className="labelAdmin">
                        <span>{activeMenu}</span>
                    </div>
                    <div className="profileAdmin">
                        {/* <button className="notification">
                            <FontAwesomeIcon icon={faBell} />
                        </button> */}
                        <img src={JSON.parse(localStorage.getItem('user')).avatar}  alt="User" className="avatarAdmin" onClick={handleShowProfile} />
                        {showProfile && (
                            <ShowProfileOption handleCloseShowProfile={handleShowProfile} />
                        )}
                    </div>
                </header>
                <section className="contentAdmin">
                    {children}
                </section>
            </main>
        </div>
    );
}

export default DefaultLayoutAdmin;
