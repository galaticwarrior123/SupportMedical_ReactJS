import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DefaultLayoutRegisterMedicalExaminationPage from '../../../../Layouts/DefaultLayoutRegisterMedicalExaminationPage/DefaultLayoutRegisterMedicalExaminationPage';
import './RegisterMedicalExaminationPage.css';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const doctors = [
    {
        id: 1,
        name: "BS CKI. Đoàn Thị Bích Vân",
        major: "Da Liễu",
        description: "Chuyên trị: Da liễu Viêm da cơ địa, vảy nến, nấm da...",
        schedule: "Thứ 2,3,4,5,6,7,Chủ nhật,Hẹn khám",
        image: "/images/pictureDoctor.jpg"

    },

    {
        id: 1,
        name: "BS CKI. Đoàn Thị Bích Vân",
        major: "Da Liễu",
        description: "Chuyên trị: Da liễu Viêm da cơ địa, vảy nến, nấm da...",
        schedule: "Thứ 2,3,4,5,6,7,Chủ nhật,Hẹn khám",
        image: "/images/pictureDoctor.jpg"

    },


    {
        id: 1,
        name: "BS CKI. Đoàn Thị Bích Vân",
        major: "Da Liễu",
        description: "Chuyên trị: Da liễu Viêm da cơ địa, vảy nến, nấm da...",
        schedule: "Thứ 2,3,4,5,6,7,Chủ nhật,Hẹn khám",
        image: "/images/pictureDoctor.jpg"

    },


    {
        id: 1,
        name: "BS CKI. Đoàn Thị Bích Vân",
        major: "Da Liễu",
        description: "Chuyên trị: Da liễu Viêm da cơ địa, vảy nến, nấm da...",
        schedule: "Thứ 2,3,4,5,6,7,Chủ nhật,Hẹn khám",
        image: "/images/pictureDoctor.jpg"

    },


    {
        id: 1,
        name: "BS CKI. Đoàn Thị Bích Vân",
        major: "Da Liễu",
        description: "Chuyên trị: Da liễu Viêm da cơ địa, vảy nến, nấm da...",
        schedule: "Thứ 2,3,4,5,6,7,Chủ nhật,Hẹn khám",
        image: "/images/pictureDoctor.jpg"

    },


    {
        id: 1,
        name: "BS CKI. Đoàn Thị Bích Vân",
        major: "Da Liễu",
        description: "Chuyên trị: Da liễu Viêm da cơ địa, vảy nến, nấm da...",
        schedule: "Thứ 2,3,4,5,6,7,Chủ nhật,Hẹn khám",
        image: "/images/pictureDoctor.jpg"

    },

    {
        id: 1,
        name: "BS CKI. Đoàn Thị Bích Vân",
        major: "Da Liễu",
        description: "Chuyên trị: Da liễu Viêm da cơ địa, vảy nến, nấm da...",
        schedule: "Thứ 2,3,4,5,6,7,Chủ nhật,Hẹn khám",
        image: "/images/pictureDoctor.jpg"

    },

    {
        id: 1,
        name: "BS CKI. Đoàn Thị Bích Vân",
        major: "Da Liễu",
        description: "Chuyên trị: Da liễu Viêm da cơ địa, vảy nến, nấm da...",
        schedule: "Thứ 2,3,4,5,6,7,Chủ nhật,Hẹn khám",
        image: "/images/pictureDoctor.jpg"

    },
];


const RegisterMedicalExaminationPage = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const doctorsPerPage = 5;

    const handleNavigate = (path) => {
        navigate(path);
    }

    const indexOfLastDoctor = currentPage * doctorsPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
    const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

    const totalPages = Math.ceil(doctors.length / doctorsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
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
                        <input type="text" placeholder="Tìm kiếm bác sĩ" />
                        {/* <button className="search-button">
                            <FontAwesomeIcon icon={faSearch} />
                        </button> */}
                    </div>
                </div>

                <div className="content-medical">
                    <div className="doctor-list-card-medical">

                        {currentDoctors.length > 0 ? currentDoctors.map((doctor, index) => (

                            <div className="doctor-card-medical" key={index}>
                                <div className="doctor-info-medical">
                                    <div className="doctor-info-medical-image">
                                        <img src="/images/pictureDoctor.jpg" alt="Doctor" />
                                        <button className="doctor-info-medical-image-button">Xem chi tiết</button>
                                    </div>
                                    <div className="doctor-details-medical">
                                        <h3>{doctor.name} | {doctor.major}</h3>
                                        <p><strong>Chuyên trị:</strong> {doctor.description}</p>
                                        <p><strong>Lịch khám:</strong> {doctor.schedule}</p>
                                    </div>
                                </div>
                                <div className="doctor-actions-medical">
                                    <div className="doctor-actions-medical-slogan">
                                        <span>Bác sĩ chuyên khoa</span>
                                        <p>Đặt lịch online qua web Clicknic</p>
                                    </div>
                                    <button className="book-button" onClick={() => handleNavigate('/select-service')}>Đặt khám ngay</button>

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
                                        <option>Da liễu</option>
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
