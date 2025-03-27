import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DefaultLayoutRegisterMedicalExaminationPage from '../../../../../Layouts/DefaultLayoutRegisterMedicalExaminationPage/DefaultLayoutRegisterMedicalExaminationPage';
import ConfirmRegisterMedicalPage from '../ConfirmRegisterMedicalPage';
import './SelectServicePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { MedExamServiceAPI } from '../../../../../API/MedExamServiceAPI';
import { toast } from 'react-toastify';
const typesOfService = {
    directExamination: 'directExamination',
    appointment: 'appointment',
    regularCheckup: 'regularCheckup',
};

const SelectServicePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const doctorSelected = location.state;

    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        MedExamServiceAPI.getMedExamServices()
            .then((response) => {
                setServices(response.data);
            })
            .catch((error) => {
                toast.error('Lỗi khi lấy dữ liệu dịch vụ khám bệnh!');
            });
    }, []);

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
            medExamService: services.find((service) => service._id === selectedService),
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
                        {services.length > 0 ? services.map((service, index) => (
                            <tr key={service._id}>
                                <td>{index + 1}</td>
                                <td>{service.name}</td>
                                <td>{service.fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}đ</td>
                                <td>
                                    <input
                                        type="radio"
                                        name="service"
                                        onChange={() => handleSelectService(service._id)}
                                        checked={selectedService === service._id}
                                    />
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4">Không có dữ liệu dịch vụ khám bệnh</td>
                            </tr>
                        )}
                        {/* <tr>
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
                        </tr> */}
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
