import { useLocation, useNavigate } from 'react-router-dom';
import DefaultLayoutRegisterMedicalExaminationPage from '../../../../../Layouts/DefaultLayoutRegisterMedicalExaminationPage/DefaultLayoutRegisterMedicalExaminationPage';
import ConfirmRegisterMedicalPage from '../ConfirmRegisterMedicalPage';
import './SelectServicePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const SelectServicePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const doctorSelected = location.state;



    const handleNavigate = (path) => {
        navigate(path, { state: doctorSelected });
    }

    return (
        <ConfirmRegisterMedicalPage>
            <div className="service-selection">
                <h3>Vui lòng chọn dịch vụ</h3>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tên dịch vụ</th>
                            <th>Giá tiền</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Đặt khám trực tiếp bác sĩ</td>
                            <td>150.000đ</td>
                            <td style={{ textAlign: "end" }}><button className="book-now-btn" onClick={() => handleNavigate('/select-record')}>Đặt khám</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <button className="back-button" onClick={() => handleNavigate('/')}>
                <FontAwesomeIcon icon={faArrowLeft} />
                Quay lại
            </button>
        </ConfirmRegisterMedicalPage>
    )
}

export default SelectServicePage;
