import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DefaultLayoutRegisterMedicalExaminationPage from '../../../../Layouts/DefaultLayoutRegisterMedicalExaminationPage/DefaultLayoutRegisterMedicalExaminationPage';
import './RegisterMedicalExaminationPage.css';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
const RegisterMedicalExaminationPage = () => {
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
                        <div className="doctor-card-medical">
                            <div className="doctor-info-medical">
                                <div className="doctor-info-medical-image">
                                    <img src="/images/pictureDoctor.jpg" alt="Doctor" />
                                    <button className="doctor-info-medical-image-button">Xem chi tiết</button>
                                </div>
                                <div className="doctor-details-medical">
                                    <h3>BS CKI. Đoàn Thị Bích Vân | Da Liễu</h3>
                                    <p><strong>Chuyên trị:</strong> Da liễu Viêm da cơ địa, vảy nến, nấm da...</p>
                                    <p><strong>Lịch khám:</strong> Thứ 2,3,4,5,6,7,Chủ nhật,Hẹn khám</p>
                                </div>
                            </div>
                            <div className="doctor-actions-medical">
                                <div className="doctor-actions-medical-slogan">
                                    <span>Bác sĩ chuyên khoa</span>
                                    <p>Đặt lịch online qua web Clicknic</p>
                                </div>
                                <button className="book-button">Đặt khám ngay</button>
                            </div>
                        </div>

                        
                    </div>

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
                </div>
            </div>
        </DefaultLayoutRegisterMedicalExaminationPage>
    );
}

export default RegisterMedicalExaminationPage;
