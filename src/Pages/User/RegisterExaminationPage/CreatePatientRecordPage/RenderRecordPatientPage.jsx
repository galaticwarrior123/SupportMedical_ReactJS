import './RenderRecordPatientPage.css';
import { RecordPatientAPI } from "../../../../API/RecordPatientAPI";
import { useState } from 'react';
import { toast } from 'react-toastify';

const RenderRecordPatientPage = () => {
    const [phone, setPhone] = useState('');
    const [listSearchResult, setListSearchResult] = useState([]);
    const user = JSON.parse(localStorage.getItem('user')) || {};

    const handleSearch = async () => {
        if (!phone) {
            toast.error('Vui lòng nhập số điện thoại!');
            return;
        }
        // // kiêm tra định dạng số điện thoại
        // const phoneRegex = /^(0[3|5|7|8|9]|01[2|6|8|9])[0-9]{8}$/;
        // if (!phoneRegex.test(phone)) {
        //     toast.error('Số điện thoại không hợp lệ!');
        //     return;
        // }
        // // kiểm tra độ dài số điện thoại
        // if (phone.length < 10 || phone.length > 11) {
        //     toast.error('Số điện thoại không hợp lệ!');
        //     return;
        // }
        // // kiểm tra số điện thoại có chứa ký tự đặc biệt hay không
        // const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/g;
        // if (specialCharRegex.test(phone)) {
        //     toast.error('Số điện thoại không hợp lệ!');
        //     return;
        // }
        // // kiểm tra số điện thoại có chứa khoảng trắng hay không
        // const spaceRegex = /\s/g;
        // if (spaceRegex.test(phone)) {
        //     toast.error('Số điện thoại không hợp lệ!');
        //     return;
        // }

        try {
            const response = await RecordPatientAPI.searchRecordPatient(phone);
            if(response.data.length === 0) {
                toast.info('Không tìm thấy bệnh nhân!');
                return;
            }
            setListSearchResult(response.data);
        } catch (error) {
            toast.error('Có lỗi xảy ra trong quá trình tìm kiếm bệnh nhân!');
        }
    }

    const handleUpdateUsingBy = async (id) => {
        try {
            const data = {
                usingBy: user._id,
            };
            await RecordPatientAPI.updateUsingBy(id, data);
            toast.success('Cập nhật thành công!');
            setListSearchResult((prev) => prev.filter((item) => item._id !== id));
        } catch (error) {
            toast.error('Có lỗi xảy ra trong quá trình cập nhật bệnh nhân!');
        }
    }

    const maskPhoneNumber = (phoneNumber) => {
        if (!phoneNumber || phoneNumber.length < 7) return phoneNumber;
        return '*'.repeat(7) + phoneNumber.slice(7);
    };

    const maskDob = (dob) => {
        if (!dob) return '';
        const [year, month, day] = dob.split('-');
        return `**-**-${year}`;
    };

    const maskAddress = (address, district) => {
        const maskedAddress = address ? '***' : '';
        const maskedDistrict = district ? '***' : '';
        return `${maskedAddress}, ${maskedDistrict}`;
    };

    return (
        <div className="render-record-patient-page">
            <div className="form-medical-container-record-patient">
                <div className="form-medical-group-record-patient">
                    <label>Số điện thoại</label>
                    <input type="text" placeholder="Vui lòng nhập số điện thoại ..." value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
            </div>
            <button className="submit-button" onClick={handleSearch}>Tìm kiếm</button>

            <div className='list-result-record-patient'>
                {listSearchResult.map((patient, index) => (
                    <div key={index} className='list-result-record-patient-item'>
                        <div className='list-result-record-patient-item-header'>
                            <div className='list-result-record-patient-item-name'>{patient.name}</div>
                            <div className='list-result-record-patient-item-info'>
                                <span>Số điện thoại: {maskPhoneNumber(patient.phoneNumber)}</span>
                                <span>Ngày sinh: {maskDob(patient.dob)}</span>
                                <span>Giới tính: {patient.gender === true ? 'Nam' : 'Nữ'}</span>
                                <span>Địa chỉ: {maskAddress(patient.address, patient.district)}, {patient.province}</span>
                            </div>
                        </div>
                        <div className='list-result-record-patient-item-footer'>
                            {patient.usingBy === user._id ? (
                                <button className='list-result-record-patient-item-footer-button disabled-btn' disabled>Đang sử dụng</button>
                            ) : (
                                <button className='list-result-record-patient-item-footer-button' onClick={() => handleUpdateUsingBy(patient._id)} >Sử dụng</button>
                            )}
                            <button className='list-result-record-patient-item-footer-button'>Xem chi tiết</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RenderRecordPatientPage;
