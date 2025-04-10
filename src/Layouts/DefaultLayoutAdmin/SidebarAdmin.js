import './SidebarAdmin.css';
import {
    faList, faChartBar, faArrowLeft, faArrowRight,
    faUserDoctor, faShare, faChevronUp, faChevronDown, faMedkit,
    faPills
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SidebarContext } from './SidebarContext';

const SidebarAdmin = ({ onMenuClick, activeMenu }) => {
    const { isCollapsed, toggleSidebar } = useContext(SidebarContext);
    const [isShiftMenuOpen, setShiftMenuOpen] = useState(false);
    const [isMedicationMenuOpen, setMedicationMenuOpen] = useState(false);
    const location = useLocation();

    const handleShiftMenuClick = () => {
        setShiftMenuOpen(prev => !prev);
    };

    const handleMedicationMenuClick = () => {
        setMedicationMenuOpen(prev => !prev);
    };

    useEffect(() => {
        const path = location.pathname;
        setShiftMenuOpen(['/admin/manage-schedule', '/admin/assign-shifts', '/admin/shift-change', '/admin/shift-segment'].includes(path));
        setMedicationMenuOpen(['/admin/type-medication', '/admin/medication'].includes(path));
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
                            to='/admin/medExamService'
                            className={`menuItemAdmin ${activeMenu === 'Quản lý dịch vụ khám' ? 'active' : ''}`}
                            onClick={() => onMenuClick('Quản lý dịch vụ khám')}>
                            <FontAwesomeIcon icon={faMedkit} />
                            <span>Quản lý dịch vụ khám</span>
                        </Link>
                    </li>
                    {/* Lịch làm việc */}
                    <li>
                        <div
                            className={`menuItemAdmin ${isShiftMenuOpen ? 'active' : ''}`}
                            onClick={handleShiftMenuClick}>
                            <FontAwesomeIcon icon={faShare} />
                            <span>Lịch làm việc</span>
                            <FontAwesomeIcon icon={isShiftMenuOpen ? faChevronUp : faChevronDown} className="arrowIcon" />
                        </div>
                        {isShiftMenuOpen && (
                            <ul className="submenuAdmin show">
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
                                        onClick={() => onMenuClick('Phân công ca trực')}>
                                        <span>Phân công ca trực</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/admin/shift-change'
                                        className={`submenuItemAdmin ${location.pathname === '/admin/shift-change' ? 'active' : ''}`}
                                        onClick={() => onMenuClick('Thay đổi ca trực')}>
                                        <span>Thay đổi ca trực</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/admin/shift-segment'
                                        className={`submenuItemAdmin ${location.pathname === '/admin/shift-segment' ? 'active' : ''}`}
                                        onClick={() => onMenuClick('Quản lý khung giờ')}>
                                        <span>Quản lý khung giờ</span>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    {/* Quản lý thuốc */}
                    <li>
                        <div
                            className={`menuItemAdmin ${isMedicationMenuOpen ? 'active' : ''}`}
                            onClick={handleMedicationMenuClick}>
                            <FontAwesomeIcon icon={faPills} />
                            <span>Quản lý thuốc</span>
                            <FontAwesomeIcon icon={isMedicationMenuOpen ? faChevronUp : faChevronDown} className="arrowIcon" />
                        </div>
                        {isMedicationMenuOpen && (
                            <ul className="submenuAdmin show">
                                <li>
                                    <Link
                                        to='/admin/type-medication'
                                        className={`submenuItemAdmin ${location.pathname === '/admin/type-medication' ? 'active' : ''}`}
                                        onClick={() => onMenuClick('Quản lý danh mục thuốc')}>
                                        <span>Quản lý danh mục thuốc</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/admin/medication'
                                        className={`submenuItemAdmin ${location.pathname === '/admin/medication' ? 'active' : ''}`}
                                        onClick={() => onMenuClick('Quản lý thuốc')}>
                                        <span>Quản lý thuốc</span>
                                    </Link>
                                </li>
                            </ul>
                        )}
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
                </ul>
            </nav>
        </aside>
    );
};

export default SidebarAdmin;
