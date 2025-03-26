import { useSelector } from "react-redux";

const PatientInfo = () => {
    const { patientProfile } = useSelector((state) => state.doctorPatientProfile);

    return (
        <div className="patient-profile-card patient-profile-info">
            <h2>Thông tin cơ bản</h2>
            {patientProfile && <div className="patient-profile-info-body">
                <div className="patient-profile-info-item">
                    <p><span className="patient-profile-info-item-label">Họ và tên:</span> {patientProfile.name}</p>
                </div>
                <div className="patient-profile-info-item">
                    <p><span className="patient-profile-info-item-label">Giới tính:</span> {patientProfile.gender ? 'Nam' : 'Nữ'}</p>
                </div>
                <div className="patient-profile-info-item">
                    <p><span className="patient-profile-info-item-label">Ngày sinh:</span> {patientProfile.dob}</p>
                </div>
                <div className="patient-profile-info-item">
                    <p><span className="patient-profile-info-item-label">Địa chỉ:</span> 
                        {` ${patientProfile.address}, ${patientProfile.ward}, ${patientProfile.district}, ${patientProfile.province}`}
                    </p>
                </div>
                <div className="patient-profile-info-item">
                    <p><span className="patient-profile-info-item-label">Số điện thoại:</span> {patientProfile.phoneNumber}</p>
                </div>
                <div className="patient-profile-info-item">
                    <p><span className="patient-profile-info-item-label">Nghề nghiệp:</span> {patientProfile.job}</p>
                </div>
            </div>}
        </div>
    );
}

export default PatientInfo;