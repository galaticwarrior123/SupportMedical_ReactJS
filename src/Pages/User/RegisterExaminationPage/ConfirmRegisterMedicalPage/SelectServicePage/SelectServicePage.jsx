import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import DefaultLayoutRegisterMedicalExaminationPage from '../../../../../Layouts/DefaultLayoutRegisterMedicalExaminationPage/DefaultLayoutRegisterMedicalExaminationPage';
import ConfirmRegisterMedicalPage from '../ConfirmRegisterMedicalPage';
import './SelectServicePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const typesOfService = {
    directExamination: 'directExamination',
    appointment: 'appointment',
    regularCheckup: 'regularCheckup',
};

const SelectServicePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const doctorSelected = location.state;

    const [selectedService, setSelectedService] = useState(null);

    const handleSelectService = (serviceType) => {
        setSelectedService(serviceType);
    };

    const handleNavigate = (path) => {
        if (!selectedService) {
            alert("Vui lòng chọn dịch vụ trước khi tiếp tục!");
            return;
        }

        const state = {
            ...doctorSelected,
            amount: 150000,
            selectedService: selectedService
        };

        navigate(path, { state: state });
    };

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
                            <th>Chọn dịch vụ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Đặt khám trực tiếp bác sĩ</td>
                            <td>150.000đ</td>
                            <td>
                                <input
                                    type="radio"
                                    name="service"
                                    onChange={() => handleSelectService(typesOfService.directExamination)}
                                    checked={selectedService === typesOfService.directExamination}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Đặt lịch hẹn khám</td>
                            <td>150.000đ</td>
                            <td>
                                <input
                                    type="radio"
                                    name="service"
                                    onChange={() => handleSelectService(typesOfService.appointment)}
                                    checked={selectedService === typesOfService.appointment}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Đặt lịch định kỳ</td>
                            <td>150.000đ</td>
                            <td>
                                <input
                                    type="radio"
                                    name="service"
                                    onChange={() => handleSelectService(typesOfService.regularCheckup)}
                                    checked={selectedService === typesOfService.regularCheckup}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className='btn-book-service'>
                    <button
                        className="book-now-btn"
                        onClick={() => handleNavigate('/select-record')}
                        disabled={!selectedService}  // Disable button if no service is selected
                        style={{
                            backgroundColor: selectedService ? '#007bff' : '#cccccc',
                            cursor: selectedService ? 'pointer' : 'not-allowed'
                        }}
                    >
                        Đặt khám
                    </button>
                </div>
            </div>
            <button className="back-button" onClick={() => navigate('/')}>
                <FontAwesomeIcon icon={faArrowLeft} />
                Quay lại
            </button>
        </ConfirmRegisterMedicalPage>
    );
}

export default SelectServicePage;
