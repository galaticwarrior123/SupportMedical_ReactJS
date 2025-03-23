import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DefaultLayoutRegisterMedicalExaminationPage from '../../../../Layouts/DefaultLayoutRegisterMedicalExaminationPage/DefaultLayoutRegisterMedicalExaminationPage';
import './RegisterMedicalExaminationPage.css';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DoctorAPI } from '../../../../API/DoctorAPI';
import { DepartmentAPI } from '../../../../API/DepartmentAPI';
import { set } from 'date-fns';
import { toast } from 'react-toastify';


const RegisterMedicalExaminationPage = () => {
    const navigate = useNavigate();
    const [searchName, setSearchName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [listDoctors, setListDoctors] = useState([]);
    const doctorsPerPage = 5;

    const handleNavigate = (path) => {
        navigate(path);
    }

    const [listSpecialities, setListSpecialities] = useState([]);

    const indexOfLastDoctor = currentPage * doctorsPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
    const currentDoctors = listDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

    const totalPages = Math.ceil(listDoctors.length / doctorsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    useEffect(() => {
        DoctorAPI.getAllDoctorHaveShift().then((response) => {
            setListDoctors(response.data);
            console.log(response.data);
        }
        ).catch((error) => {
            toast.error("Lỗi khi lấy danh sách bác sĩ");
        });
    }, []);

    useEffect(() => {
        DepartmentAPI.getAll().then((response) => {
            setListSpecialities(response.data);
        }).catch((error) => {
            toast.error("Lỗi khi lấy danh sách chuyên khoa");
        });
    }, []);

    const handleDirectSelectService = (doctor) => () => {
        navigate('/select-service', { state: doctor });
    }

    return (
        <DefaultLayoutRegisterMedicalExaminationPage>
            <div className="register-medical-page">
                <div className="banner">
                    <div className="banner-left">
                        <div className="banner-left-container">
                            <h1>ĐẶT KHÁM THEO BÁC SĨ</h1>
                            <p>Chủ động chọn bác sĩ mà bạn tin tưởng, an tâm khám bệnh</p>
                        </div>

                    </div>
                    <div className="banner-right">
                        <img src="/images/bannerDoctor.png" alt="BannerDoctor" />
                    </div>
                </div>

                <div className="search-section">
                    <div className="search-section-input">
                        <input type="text" placeholder="Tìm kiếm bác sĩ" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
                        {/* <button className="search-button">
                            <FontAwesomeIcon icon={faSearch} />
                        </button> */}
                    </div>
                </div>

                <div className="content-medical">
                    <div className="doctor-list-card-medical">

                        {currentDoctors.length > 0 ? currentDoctors.filter(doctor => doctor.doctor.firstName.toLowerCase().includes(searchName.toLowerCase()) || doctor.doctor.lastName.toLowerCase().includes(searchName.toLowerCase())).map((doctorItem, index) => (
                            <div className="doctor-card-medical" key={index}>
                                <div className="doctor-info-medical">
                                    <div className="doctor-info-medical-image">
                                        <img src={doctorItem.doctor.avatar || '/images/account.png'} alt="Doctor" />
                                        <button className="doctor-info-medical-image-button">Xem chi tiết</button>
                                    </div>
                                    <div className="doctor-details-medical">
                                        <h3>{doctorItem.doctor.firstName} {doctorItem.doctor.lastName}  | {doctorItem.doctor.doctorInfo.specialities[0].name}</h3>
                                        <p><strong>Chuyên trị:</strong> {doctorItem.doctor.doctorInfo.treatmentDescription || 'Chưa cập nhật'}</p>
                                        <p><strong>Lịch khám: </strong> Thứ 2,3,4,5,6,7,CN</p>
                                    </div>
                                </div>
                                <div className="doctor-actions-medical">
                                    <div className="doctor-actions-medical-slogan">
                                        <span>Bác sĩ chuyên khoa</span>
                                        <p>Đặt lịch online qua web Clicknic</p>
                                    </div>
                                    <button className="book-button" onClick={handleDirectSelectService(doctorItem)}>Đặt khám ngay</button>

                                </div>
                            </div>

                        )) : <p style={{ textAlign: "center" }}>Không có bác sĩ nào</p>}



                        <div className="doctor-list-card-medical-pagination">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button key={index + 1} onClick={() => handlePageChange(index + 1)}
                                    className={currentPage === index + 1 ? 'active' : ''}>
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className='filter-right'>
                        <div className="filter-box">
                            <h3>Tìm kiếm tùy chỉnh</h3>
                            <div className="filter-box-content">
                                <div className="filter-item">
                                    <label>Thời gian:</label>
                                    <div className="filter-item-content">
                                        <div className="filter-item-content-up">
                                            <div className="filter-item-content-up-sub">
                                                <label>Ngày:</label>
                                                <select>
                                                    <option>1</option>
                                                </select>
                                            </div>
                                            <div className="filter-item-content-up-sub">
                                                <label>Tháng:</label>
                                                <select>
                                                    <option>1</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="filter-item-content-down">
                                            <label>Năm:</label>
                                            <select>
                                                <option>2025</option>
                                            </select>
                                        </div>

                                    </div>
                                </div>
                                <div className="filter-item">
                                    <label>Chuyên khoa:</label>
                                    <select>
                                        {listSpecialities.map((speciality, index) => (
                                            <option key={index}>{speciality.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button className="filter-button">Tìm kiếm</button>
                            </div>
                        </div>



                        <div className="box-banner">
                            <h3> Tham gia diễn đàn </h3>
                            <div className='box-banner-content'>
                                <img src="/images/pictureDoctor2.jpg" alt="Banner" />
                                <p>Tham gia diễn đàn để trao đổi thông tin với bác sĩ và người bệnh khác</p>
                                <button className="forum-button" onClick={() => handleNavigate('/forum')}>Tham gia diễn đàn</button>
                            </div>

                        </div>

                    </div>


                </div>
            </div>
        </DefaultLayoutRegisterMedicalExaminationPage>
    );
}

export default RegisterMedicalExaminationPage;
