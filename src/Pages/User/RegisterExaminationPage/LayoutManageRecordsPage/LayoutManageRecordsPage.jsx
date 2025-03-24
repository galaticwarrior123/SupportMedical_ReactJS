import { useNavigate, useLocation } from 'react-router-dom';
import DefaultLayoutRegisterMedicalExaminationPage from '../../../../Layouts/DefaultLayoutRegisterMedicalExaminationPage/DefaultLayoutRegisterMedicalExaminationPage';
import './LayoutManageRecordsPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faBell, faCalendarCheck, faPlus } from '@fortawesome/free-solid-svg-icons';



const LayoutManageRecordsPage = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigate = (path) => {
        navigate(path);
    }

    return (
        <DefaultLayoutRegisterMedicalExaminationPage>
            <div className="manage-records-page">
                {/* Sidebar */}
                <div className="sidebar-manage-records" >
                    <div className="sidebar-sub-manage-records">
                        <button className="add-record-btn" onClick={() => handleNavigate('/create-patient-record')}>
                            <FontAwesomeIcon icon={faPlus} className="fa-icon" /> Thêm hồ sơ
                        </button>
                        <div className="box-option-manage-records">
                            <button 
                                className={`sidebar-btn ${location.pathname === '/manage-records' ? 'active' : ''}`} 
                                onClick={() => handleNavigate('/manage-records')}>
                                <FontAwesomeIcon icon={faAddressCard} className="fa-icon" />
                                Hồ sơ bệnh nhân
                            </button>
                            <button 
                                className={`sidebar-btn ${location.pathname === '/my-appointments' ? 'active' : ''}`} 
                                onClick={() => handleNavigate('/my-appointments')}>
                                <FontAwesomeIcon icon={faCalendarCheck} className="fa-icon" />
                                Lịch hẹn của tôi
                            </button>
                            <button 
                                className={`sidebar-btn ${location.pathname === '/notifications' ? 'active' : ''}`} 
                                onClick={() => handleNavigate('/notifications')}>
                                <FontAwesomeIcon icon={faBell} className="fa-icon" />
                                Thông báo
                            </button>
                        </div>
                    </div>

                </div>

                {/* Main content */}
                <div className="main-content-manage-records">
                    {children}
                </div>
            </div>
        </DefaultLayoutRegisterMedicalExaminationPage>
    )
}

export default LayoutManageRecordsPage;
