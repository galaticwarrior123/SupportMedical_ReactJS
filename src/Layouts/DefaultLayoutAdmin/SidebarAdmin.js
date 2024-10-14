import './SidebarAdmin.css';
import { faList, faComments, faChartBar, faArrowLeft, faArrowRight, faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SidebarContext } from './SidebarContext';

const SidebarAdmin = ({ onMenuClick, activeMenu }) => {
    const { isCollapsed, toggleSidebar } = useContext(SidebarContext);
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
                            className={`menuItemAdmin ${activeMenu === 'Quản lý danh mục' ? 'active' : ''}`}
                            onClick={() => onMenuClick('Quản lý danh mục')}>
                            <FontAwesomeIcon icon={faList} />
                            <span>Quản lý danh mục</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to='/admin/doctors'
                            className={`menuItemAdmin ${activeMenu === 'Quản lý bác sĩ' ? 'active' : ''}`}
                            onClick={() => onMenuClick('Quản lý bác sĩ')}>
                            <FontAwesomeIcon icon={faUserDoctor} />
                            <span>Cấp quyền phê duyệt</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to='/admin/browse-post'
                            className={`menuItemAdmin ${activeMenu === 'Duyệt bài viết' ? 'active' : ''}`}
                            onClick={() => onMenuClick('Duyệt bài viết')}>
                            <FontAwesomeIcon icon={faComments} />
                            <span>Duyệt bài viết</span>
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
                </ul>
            </nav>
        </aside>
    );
}

export default SidebarAdmin;
