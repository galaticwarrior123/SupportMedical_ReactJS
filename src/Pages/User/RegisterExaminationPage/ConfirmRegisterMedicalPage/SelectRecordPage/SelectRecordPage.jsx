import { useLocation, useNavigate } from 'react-router-dom';
import ConfirmRegisterMedicalPage from '../ConfirmRegisterMedicalPage';
import './SelectRecordPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

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
    const navigate = useNavigate();
    const [activeRecordIndex, setActiveRecordIndex] = useState(null);
    const location = useLocation();
    const doctorSelected = location.state;

    const handleNavigate = (path) => {
        navigate(path, { state: doctorSelected });
    }

    const handleRecordClick = (index) => {
        setActiveRecordIndex(index === activeRecordIndex ? null : index);
    };


    return (
        <ConfirmRegisterMedicalPage>
            <div className="record-selection">
                <h3>Vui lòng chọn hồ sơ</h3>
                <div className="record-select-list">
                    {records.length > 0 ? records.map((record, index) => (
                        <div className="record-select-card" key={index} onClick={() => handleRecordClick(index)}>
                            <p><strong>Họ và tên:</strong> <span >{record.name}</span></p>
                            <p><strong>Ngày sinh:</strong> {record.dob}</p>
                            <p><strong>Số điện thoại:</strong> {record.phone}</p>
                            <p><strong>Giới tính:</strong> {record.gender}</p>
                            <p><strong>Địa chỉ:</strong> {record.address}</p>


                            {activeRecordIndex === index && (
                                <div className="record-actions">
                                    <div className='record-actions-left'>
                                        <button className="action-button-delete" >Xóa</button>
                                        <button className="action-button-edit" >Sửa</button>
                                    </div>
                                    <button className="action-button" onClick={() => handleNavigate('/select-day')}>Tiếp theo</button>
                                </div>
                            )}
                        </div>


                    )) : <p style={{ textAlign: "center" }}>Không có hồ sơ nào, vui lòng thêm hồ sơ
                        <a href="/create-patient-record" style={{ color: "#2697EC", textDecoration: "none" }}> tại đây</a>
                    </p>}
                </div>
            </div>
            <button className="back-button" onClick={() => handleNavigate('/select-service')}>
                <FontAwesomeIcon icon={faArrowLeft} />
                Quay lại
            </button>
        </ConfirmRegisterMedicalPage>
    );
}

export default SelectRecordPage;
