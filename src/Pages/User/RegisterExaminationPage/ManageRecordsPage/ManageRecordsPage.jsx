import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DefaultLayoutRegisterMedicalExaminationPage from '../../../../Layouts/DefaultLayoutRegisterMedicalExaminationPage/DefaultLayoutRegisterMedicalExaminationPage';
import './ManageRecordsPage.css';
import { faUser, faBirthdayCake, faPhone, faVenusMars, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';

const ManageRecordsPage = () => {
    return (
        <DefaultLayoutRegisterMedicalExaminationPage>
            <div className="manage-records-page">
                {/* Sidebar */}
                <div className="sidebar-manage-records">
                    <button className="add-record-btn">Thêm hồ sơ</button>
                    <div className="box-option-manage-records">
                        <button className="sidebar-btn">Hồ sơ bệnh nhân</button>
                        <button className="sidebar-btn">Thông báo</button>
                    </div>
                </div>

                {/* Main content */}
                <div className="main-content-manage-records">
                    <h2 className="title-manage-records">Danh sách hồ sơ bệnh nhân</h2>

                    <div className="record-card">
                        <div className="record-card-up">
                            <p>
                                <FontAwesomeIcon icon={faUser} className="fa-icon" />
                                <strong>Họ và tên:</strong> <strong style={{color: "#2697EC"}}>Nguyễn Văn A</strong>
                            </p>
                            <p>
                                <FontAwesomeIcon icon={faBirthdayCake} className="fa-icon" />
                                <strong>Ngày sinh:</strong> 01/01/1990
                            </p>
                            <p>
                                <FontAwesomeIcon icon={faPhone} className="fa-icon" />
                                <strong>Số điện thoại:</strong> 0123456789
                            </p>
                            <p>
                                <FontAwesomeIcon icon={faVenusMars} className="fa-icon" />
                                <strong>Giới tính:</strong> Nam
                            </p>
                            <p>
                                <FontAwesomeIcon icon={faMapMarkedAlt} className="fa-icon" />
                                <strong>Địa chỉ:</strong> 123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh
                            </p>
                        </div>


                        <div className="action-buttons-manage-records">
                            <button className="edit-btn-manage-records">Sửa hồ sơ</button>
                            <button className="delete-btn-manage-records">Xóa hồ sơ</button>

                        </div>
                    </div>


                    
                </div>





                
            </div>
        </DefaultLayoutRegisterMedicalExaminationPage>
    )
}

export default ManageRecordsPage;
