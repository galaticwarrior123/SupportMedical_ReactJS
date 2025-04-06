import './SidebarDoctor.css';
import { faList, faComments, faChartBar, faArrowLeft, faArrowRight, faUserDoctor, faRetweet, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SidebarContext } from './SidebarContext';

const SidebarDoctor = ({ onMenuClick, activeMenu }) => {
    const { isCollapsed, toggleSidebar } = useContext(SidebarContext);
    return (
        <aside className={`sidebarDoctor ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="logoDoctor">
                <div className="logoDoctor-image">
                    <img src="/images/Logo.png" alt="Clicknic" />
                </div>
                <div className='logoDoctor-arrow'>
                    <button onClick={toggleSidebar}>
                        <FontAwesomeIcon icon={isCollapsed ? faArrowRight : faArrowLeft} />
                    </button>
                </div>
            </div>
            <nav className="menuDoctor">
                <ul>
                    <li>
                        <Link
                            to='/doctor'
                            className={`menuItemDoctor ${activeMenu === 'Tổng quan' ? 'active' : ''}`}
                            onClick={() => onMenuClick('Tổng quan')}>
                            <FontAwesomeIcon icon={faList} />
                            <span>Tổng quan</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to='/doctor/patient-profile'
                            className={`menuItemDoctor ${activeMenu === 'Hồ sơ bệnh nhân' ? 'active' : ''}`}
                            onClick={() => onMenuClick('Hồ sơ bệnh nhân')}>
                            <FontAwesomeIcon icon={faIdCard} />
                            <span>Hồ sơ bệnh nhân</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to='/doctor/schedule'
                            className={`menuItemDoctor ${activeMenu === 'Lịch làm việc' ? 'active' : ''}`}
                            onClick={() => onMenuClick('Lịch làm việc')}>
                            <FontAwesomeIcon icon={faChartBar} />
                            <span>Lịch làm việc</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to='/doctor/shift-change'
                            className={`menuItemDoctor ${activeMenu === 'Thay đổi ca' ? 'active' : ''}`}
                            onClick={() => onMenuClick('Thay đổi ca')}>
                            <FontAwesomeIcon icon={ faRetweet} />
                            <span>Thay đổi ca</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to='/doctor/update-profile'
                            className={`menuItemDoctor ${activeMenu === 'Cập nhật hồ sơ' ? 'active' : ''}`}
                            onClick={() => onMenuClick('Cập nhật hồ sơ')}>
                            <FontAwesomeIcon icon={ faIdCard} />
                            <span>Cập nhật hồ sơ</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default SidebarDoctor;
