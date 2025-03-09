import DefaultLayoutRegisterMedicalExaminationPage from '../../../../../Layouts/DefaultLayoutRegisterMedicalExaminationPage/DefaultLayoutRegisterMedicalExaminationPage';
import ConfirmRegisterMedicalPage from '../ConfirmRegisterMedicalPage';
import './SelectServicePage.css';

const SelectServicePage = () => {
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
                            <td style={{ textAlign: "end" }}><button className="book-now-btn">Đặt khám ngay</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </ConfirmRegisterMedicalPage>
    )
}

export default SelectServicePage;
