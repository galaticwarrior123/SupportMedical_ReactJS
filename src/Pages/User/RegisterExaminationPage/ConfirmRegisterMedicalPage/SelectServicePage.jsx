import DefaultLayoutRegisterMedicalExaminationPage from '../../../../Layouts/DefaultLayoutRegisterMedicalExaminationPage/DefaultLayoutRegisterMedicalExaminationPage';
import './SelectServicePage.css';

const SelectServicePage = () => {
    return (
        <DefaultLayoutRegisterMedicalExaminationPage>
            <div className="select-service-container">
                {/* Thông tin lịch hẹn */}
                <div className="appointment-info">
                    <h3>Thông tin lịch hẹn</h3>
                    <p><strong>Chuyên khoa:</strong> Da liễu</p>
                    <p><strong>Bác sĩ:</strong> CKI. Đoàn Thị Bích Vân</p>
                </div>

                {/* Bảng chọn dịch vụ */}
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
                                <td style={{textAlign:"end"}}><button className="book-now-btn">Đặt khám ngay</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </DefaultLayoutRegisterMedicalExaminationPage>
    )
}

export default SelectServicePage;
