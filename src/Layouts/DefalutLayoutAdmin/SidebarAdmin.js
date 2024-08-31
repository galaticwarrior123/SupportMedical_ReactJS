import './SidebarAdmin.css';
import { faList, faComments, faChartBar, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const SidebarAdmin = ({ isCollapsed, toggleSidebar, onMenuClick, activeMenu }) => {


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
                        <button
                            className={`menuItemAdmin ${activeMenu === 'Quản lý danh mục' ? 'active' : ''}`}
                            onClick={() => onMenuClick('Quản lý danh mục')}>
                            <FontAwesomeIcon icon={faList} />
                            <span>Quản lý danh mục</span>
                        </button>
                    </li>
                    <li>
                        <button
                            className={`menuItemAdmin ${activeMenu === 'Duyệt hồ sơ' ? 'active' : ''}`}
                            onClick={() => onMenuClick('Duyệt hồ sơ')}>
                            <FontAwesomeIcon icon={faComments} />
                            <span>Duyệt hồ sơ</span>
                        </button>
                    </li>
                    <li>
                        <button
                            className={`menuItemAdmin ${activeMenu === 'Thống kê' ? 'active' : ''}`}
                            onClick={() => onMenuClick('Thống kê')}>
                            <FontAwesomeIcon icon={faChartBar} />
                            <span>Thống kê</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>

    )
}

export default SidebarAdmin;