import './DefaultLayoutAdmin.css';
import { useState } from 'react';
import SidebarAdmin from './SidebarAdmin';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const DefaultLayoutAdmin = ({children}) => {
    const [isCollapsed, setIsCollapse] = useState(false);
    const [activeMenu, setActiveMenu] = useState('Quản lý danh mục');

    const toggleSidebar = () => {
        setIsCollapse(!isCollapsed);
    }

    const handleMenuClick = (text) => {
        setActiveMenu(text);
    }
    return (
        <div className={`adminContainer ${isCollapsed ? 'collapsed' : ''}`}>
            <SidebarAdmin 
                    isCollapsed={isCollapsed} 
                    toggleSidebar={toggleSidebar} 
                    onMenuClick={handleMenuClick} 
                    activeMenu={activeMenu} />
            <main className="mainContentAdmin">
                <header className="headerAdmin">
                    <div className="labelAdmin">
                        <span>{activeMenu}</span>
                    </div>
                    <div className="profileAdmin">
                        <button className="notification">
                            <FontAwesomeIcon icon={faBell} />
                        </button>
                        <img src="https://via.placeholder.com/30" alt="User" className="avatarAdmin" />
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