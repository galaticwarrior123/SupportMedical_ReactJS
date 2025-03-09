import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './HeaderRegisterMedicalMedicalExaminationPage.css';
import { faBell } from '@fortawesome/free-solid-svg-icons';

const HeaderRegisterMedicalExaminationPage = () => {
    return (
        <div className="header-register-medical-examination-page">
            <div className="logo">
                <img src="/images/Logo.png" alt="logo" />
            </div>
            <div className="user-info">
                <FontAwesomeIcon icon={faBell} className="icon-bell" />
                <button className="user-button">
                    <img src="/images/Avatar.png" alt="user" />
                    <span>Nguyễn Văn A</span>
                </button>
            </div>
        </div>
    );
}
export default HeaderRegisterMedicalExaminationPage;