import DefaultLayoutRegisterMedicalExaminationPage from '../../../../Layouts/DefaultLayoutRegisterMedicalExaminationPage/DefaultLayoutRegisterMedicalExaminationPage';
import './RegisterMedicalExaminationPage.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DoctorAPI } from '../../../../API/DoctorAPI';
import { DepartmentAPI } from '../../../../API/DepartmentAPI';
import { toast } from 'react-toastify';
import ModalDoctorInfo from './ModalDoctorInfo';
import { ResultRegistrationAPI } from '../../../../API/ResultRegistrationAPI';

const RegisterMedicalExaminationPage = () => {
    const navigate = useNavigate();
    const [searchName, setSearchName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [listDoctors, setListDoctors] = useState([]);
    const doctorsPerPage = 5;

    const today = new Date();
    const [selectedDay, setSelectedDay] = useState(new Date().getDate());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedSpeciality, setSelectedSpeciality] = useState('all');
    const [daysInMonth, setDaysInMonth] = useState([]);

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [detailDoctor, setDetailDoctor] = useState({});
    // Hàm kiểm tra năm nhuận
    const isLeapYear = (year) => {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    };

    // Hàm tính số ngày trong tháng dựa trên tháng và năm
    const calculateDaysInMonth = (month, year) => {
        if (month === 2) { // Tháng 2
            return isLeapYear(year) ? 29 : 28;
        }
        // Các tháng có 31 ngày
        if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
            return 31;
        }
        // Các tháng có 30 ngày
        return 30;
    };

    // Cập nhật số ngày khi tháng hoặc năm thay đổi
    useEffect(() => {
        const days = Array.from({ length: calculateDaysInMonth(selectedMonth, selectedYear) }, (_, i) => i + 1);
        setDaysInMonth(days);
    }, [selectedMonth, selectedYear]);



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

    const handleDirectSelectService = (doctor) => async() => {
        if(localStorage.getItem('token') === null) {
            navigate('/login');
            return;
        }

        const hasPending = await checkHasExamination();
        if(hasPending === true) {
            toast.error("Bạn đã có lịch khám chưa hoàn thành, vui lòng kiểm tra lại!");
            return;
        }
        navigate('/select-service', { state: doctor });
    }

    const handleFilter = () => {
        // kiểm tra dữ liệu đầu vào nhỏ hơn ngày hiện tại hay không
        if (selectedYear < today.getFullYear() || (selectedYear === today.getFullYear() && selectedMonth < today.getMonth() + 1) || (selectedYear === today.getFullYear() && selectedMonth === today.getMonth() + 1 && selectedDay < today.getDate())) {
            toast.error("Ngày bạn chọn nhỏ hơn ngày hiện tại");
            return;
        }


        const filter = {
            day: selectedDay,
            month: selectedMonth,
            year: selectedYear,
            specialtyId: selectedSpeciality === 'all' ? null : listSpecialities.find(speciality => speciality.name === selectedSpeciality)._id
        }
        DoctorAPI.getDoctorsHaveShiftFilter(filter).then((response) => {
            setListDoctors(response.data);
            setCurrentPage(1);

        }).catch((error) => {
            toast.error("Lỗi khi lọc danh sách bác sĩ");
        });
    }

    const handleOpenModal = (doctor) => {

        setIsOpenModal(true);
        setDetailDoctor(doctor);
    }


    const checkHasExamination = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            toast.error("Vui lòng đăng nhập để thực hiện chức năng này");
            return;
        }
        const response = await ResultRegistrationAPI.getAllResultRegistration(user._id);

        // kiểm tra xem có lịch khám nào có status là pendinhg hay không
        const hasPendingExamination = response.data.some(item => item.status === 'pending');
        if (hasPendingExamination) {
            return true;
        }
        else {
            return false;
        }
    }

    return (
        <DefaultLayoutRegisterMedicalExaminationPage>
            {isOpenModal && (
                <ModalDoctorInfo doctor={detailDoctor} onClose={() => setIsOpenModal(false)} />
            )}

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
                                        <button className="doctor-info-medical-image-button" onClick={() => handleOpenModal(doctorItem.doctor)}>Xem thông tin</button>
                                    </div>
                                    <div className="doctor-details-medical">
                                        {/* | {doctorItem.doctor.doctorInfo.specialities[0].name} */}
                                        <h3>BS. {doctorItem.doctor.firstName} {doctorItem.doctor.lastName}  </h3> 
                                        <p><strong>Chuyên trị:</strong> {doctorItem.doctor.doctorInfo.treatment || 'Chưa cập nhật'}</p>
                                        <p><strong>Chuyên khoa: </strong> {doctorItem.doctor.doctorInfo.specialities[0].name}</p>
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
                                                <select value={selectedDay} onChange={(e) => setSelectedDay(Number(e.target.value))}>
                                                    {daysInMonth.map((day) => (
                                                        <option key={day} value={day}>{day}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="filter-item-content-up-sub">
                                                <label>Tháng:</label>
                                                <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                                                    {Array.from({ length: 12 }, (_, i) => (
                                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="filter-item-content-down">
                                            <label>Năm:</label>
                                            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                                                {Array.from({ length: 20 }, (_, i) => (
                                                    <option key={2025 - i} value={2025 - i}>{2025 - i}</option>
                                                ))}
                                            </select>
                                        </div>

                                    </div>
                                </div>
                                <div className="filter-item">
                                    <label>Chuyên khoa:</label>
                                    <select value={selectedSpeciality} onChange={(e) => setSelectedSpeciality(e.target.value)}>
                                        <option value="all">Tất cả</option>
                                        {listSpecialities.map((speciality, index) => (
                                            <option key={index}>{speciality.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button className="filter-button" onClick={() => handleFilter()}>Tìm kiếm</button>
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


                        {/* <div className="box-banner">
                            <h3> Trợ lý đặt lịch khám </h3>
                            <div className='box-banner-content'>
                                <img src="/images/botChat.jpg" alt="Banner" />
                                <p>Đặt lịch khám dễ dàng hơn với trợ lý ảo</p>
                                <button className="forum-button" onClick={() => handleNavigate('/speech-bot')}>Trợ lý ảo</button>
                            </div>
                        </div> */}
                    </div>


                </div>
            </div>
        </DefaultLayoutRegisterMedicalExaminationPage>
    );
}

export default RegisterMedicalExaminationPage;
