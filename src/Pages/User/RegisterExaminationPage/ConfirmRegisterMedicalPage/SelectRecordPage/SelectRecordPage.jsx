import ConfirmRegisterMedicalPage from '../ConfirmRegisterMedicalPage';
import './SelectRecordPage.css';

const records = [
    {
        name: "Nguyễn Văn A",
        dob: "01/01/2003",
        phone: "0823452359",
        gender: "Nam",
        address: "Số 1, Võ Văn Ngân, Thành phố Thủ Đức, Thành phố Hồ Chí Minh"
    },
    {
        name: "Nguyễn Văn B",
        dob: "01/02/2003",
        phone: "0823452559",
        gender: "Nam",
        address: "Số 2, Võ Văn Ngân, Thành phố Thủ Đức, Thành phố Hồ Chí Minh"
    },

    {
        name: "Nguyễn Văn B",
        dob: "01/02/2003",
        phone: "0823452559",
        gender: "Nam",
        address: "Số 2, Võ Văn Ngân, Thành phố Thủ Đức, Thành phố Hồ Chí Minh"
    },


    {
        name: "Nguyễn Văn B",
        dob: "01/02/2003",
        phone: "0823452559",
        gender: "Nam",
        address: "Số 2, Võ Văn Ngân, Thành phố Thủ Đức, Thành phố Hồ Chí Minh"
    },

    {
        name: "Nguyễn Văn B",
        dob: "01/02/2003",
        phone: "0823452559",
        gender: "Nam",
        address: "Số 2, Võ Văn Ngân, Thành phố Thủ Đức, Thành phố Hồ Chí Minh"
    }
];

const SelectRecordPage = () => {
    return (
        <ConfirmRegisterMedicalPage>
            <div className="record-selection">
                <h3>Vui lòng chọn hồ sơ</h3>
                <div className="record-select-list">
                    {records.map((record, index) => (
                        <div className="record-select-card" key={index}>
                            <p><strong>Họ và tên:</strong> <a href="#">{record.name}</a></p>
                            <p><strong>Ngày sinh:</strong> {record.dob}</p>
                            <p><strong>Số điện thoại:</strong> {record.phone}</p>
                            <p><strong>Giới tính:</strong> {record.gender}</p>
                            <p><strong>Địa chỉ:</strong> {record.address}</p>
                        </div>
                    ))}
                </div>
            </div>
        </ConfirmRegisterMedicalPage>
    );
}

export default SelectRecordPage;
