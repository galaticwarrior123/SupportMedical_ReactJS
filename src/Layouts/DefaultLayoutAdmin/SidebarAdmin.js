import './SidebarAdmin.css';
import { faList, faComments, faChartBar, faArrowLeft, faArrowRight, faUserDoctor, faShare, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SidebarContext } from './SidebarContext';

const SidebarAdmin = ({ onMenuClick, activeMenu }) => {
    const { isCollapsed, toggleSidebar } = useContext(SidebarContext);
    const [isShiftMenuOpen, setShiftMenuOpen] = useState(false);
    const location = useLocation();

    const handleShiftMenuClick = () => {
        setShiftMenuOpen(prev => !prev);
        onMenuClick('Lịch làm việc');
    }

    useEffect(() => {
        const currentPath = location.pathname;
        if (currentPath === '/admin/manage-schedule' || currentPath === '/admin/assign-shifts') {
            setShiftMenuOpen(true);
        } else {
            setShiftMenuOpen(false);
        }
    }, [location.pathname]);

    return (
        <aside className={`sidebarAdmin ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="logoAdmin">
                <div className="logoAdmin-image">
                    <img src="/images/Logo.png" alt="Clicknic" />
                </div>
                <div className='logoAdmin-arrow'>
                    <button onClick={toggleSidebar}>
                        <FontAwesomeIcon icon={isCollapsed ? faArrowRight : faArrowLeft} />
                    </button>
                </div>
            </div>
            <nav className="menuAdmin">
                <ul>
                    <li>
                        <Link
                            to='/admin/categories'
                            className={`menuItemAdmin ${activeMenu === 'Quản lý khoa' ? 'active' : ''}`}
                            onClick={() => onMenuClick('Quản lý khoa')}>
                            <FontAwesomeIcon icon={faList} />
                            <span>Quản lý khoa</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to='/admin/doctors'
                            className={`menuItemAdmin ${activeMenu === 'Quản lý bác sĩ' ? 'active' : ''}`}
                            onClick={() => onMenuClick('Quản lý bác sĩ')}>
                            <FontAwesomeIcon icon={faUserDoctor} />
                            <span>Quản lý bác sĩ</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to='/admin/dashboard'
                            className={`menuItemAdmin ${activeMenu === 'Thống kê' ? 'active' : ''}`}
                            onClick={() => onMenuClick('Thống kê')}>
                            <FontAwesomeIcon icon={faChartBar} />
                            <span>Thống kê</span>
                        </Link>
                    </li>
                    <li>
                        <div
                            className={`menuItemAdmin ${isShiftMenuOpen || location.pathname.includes('/admin/manage-schedule') || location.pathname.includes('/admin/assign-shifts') ? 'active' : ''}`}
                            onClick={handleShiftMenuClick}>
                            <FontAwesomeIcon icon={faShare} />
                            <span>Lịch làm việc</span>
                            <FontAwesomeIcon icon={isShiftMenuOpen ? faChevronUp : faChevronDown} className="arrowIcon" />
                        </div>
                        {isShiftMenuOpen && (
                            <ul className= {`submenuAdmin ${isShiftMenuOpen ? 'show' : ''}`}>
                                <li>
                                    <Link
                                        to='/admin/manage-schedule'
                                        className={`submenuItemAdmin ${location.pathname === '/admin/manage-schedule' ? 'active' : ''}`}
                                        onClick={() => onMenuClick('Quản lý lịch làm việc')}>
                                        <span>Quản lý lịch làm việc</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/admin/assign-shifts'
                                        className={`submenuItemAdmin ${location.pathname === '/admin/assign-shifts' ? 'active' : ''}`}
                                        onClick={() => onMenuClick('Phân công')}>
                                        <span>Phân công ca trực </span>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default SidebarAdmin;
