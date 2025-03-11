
const PatientInfo = () => {
    return (
        <div className="patient-profile-card patient-profile-info">
            <h2>Thông tin cơ bản</h2>
            <div className="patient-profile-info-body">
                <div className="patient-profile-info-item">
                    <p><span className="patient-profile-info-item-label">Họ và tên:</span> Nguyễn Văn A</p>
                </div>
                <div className="patient-profile-info-item">
                    <p><span className="patient-profile-info-item-label">Giới tính:</span> Nam</p>
                </div>
                <div className="patient-profile-info-item">
                    <p><span className="patient-profile-info-item-label">Ngày sinh:</span> 23/8/2003</p>
                </div>
                <div className="patient-profile-info-item">
                    <p><span className="patient-profile-info-item-label">Địa chỉ:</span> 123 Nguyễn Chí Thanh, Hà Nội</p>
                </div>
                <div className="patient-profile-info-item">
                    <p><span className="patient-profile-info-item-label">Số điện thoại:</span> 0123456789</p>
                </div>
                <div className="patient-profile-info-item">
                    <p><span className="patient-profile-info-item-label">Nghề nghiệp:</span> CEO</p>
                </div>
            </div>
        </div>
    );
}

export default PatientInfo;