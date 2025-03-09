import DefaultLayoutRegisterMedicalExaminationPage from '../../../../Layouts/DefaultLayoutRegisterMedicalExaminationPage/DefaultLayoutRegisterMedicalExaminationPage';
import './CreatePatientRecordPage.css';

const CreatePatientRecordPage = () => {
    return (
        <DefaultLayoutRegisterMedicalExaminationPage>
            <div className="create-patient-record">
                <h2 className="title">TẠO MỚI HỒ SƠ</h2>

                <div className="form-medical-container">
                    <div className="form-medical-group">
                        <label>Họ và tên (có dấu)</label>
                        <input type="text" placeholder="VD: Nguyễn Văn A" />
                    </div>

                    <div className="form-medical-group">
                        <label>Ngày sinh (ngày/tháng/năm)</label>
                        <div className="date-inputs">
                            <select><option>Ngày</option></select>
                            <select><option>Tháng</option></select>
                            <select><option>Năm</option></select>
                        </div>
                    </div>

                    <div className="form-medical-group">
                        <label>Số điện thoại</label>
                        <input type="text" placeholder="Vui lòng nhập số điện thoại ..." />
                    </div>

                    <div className="form-medical-group">
                        <label>Giới tính</label>
                        <select><option>Chọn giới tính</option></select>
                    </div>

                    <div className="form-medical-group">
                        <label>Nghề nghiệp</label>
                        <select><option>Chọn nghề nghiệp</option></select>
                    </div>

                    <div className="form-medical-group">
                        <label>Địa chỉ</label>
                        <input type="text" placeholder="Nhập số nhà, tên đường, ấp xóm, ..." />
                    </div>

                    <div className="form-medical-group">
                        <label>Tỉnh / Thành</label>
                        <select><option>Chọn tỉnh thành</option></select>
                    </div>

                    <div className="form-medical-group">
                        <label>Quận / Huyện</label>
                        <select><option>Chọn quận huyện</option></select>
                    </div>

                    <div className="form-medical-group">
                        <label>Phường / Xã</label>
                        <select><option>Chọn phường xã</option></select>
                    </div>
                </div>

                <button className="submit-button">Tạo mới</button>
            </div>
        </DefaultLayoutRegisterMedicalExaminationPage>
    );
}

export default CreatePatientRecordPage;
