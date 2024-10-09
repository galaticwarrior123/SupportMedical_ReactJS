import './ListDoctor.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { DoctorAPI } from '../../../API/DoctorAPI';
const ListDoctor = ({ doctors }) => {
    const handlePermission = async (doctorId) => {
        try {
            const response = await DoctorAPI.permissionDoctor({ doctorId });
            if (response.status === 200) {
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div className="list-doctor">
            <div className="list-doctor-overlay">
                <div className="list-doctor-overlay-body">
                    <div className="list-doctor-header">
                        <span>Danh sách bác sĩ</span>
                    </div>
                    <div className="list-doctor-search" style={{ marginTop:10, marginLeft:10 }}>
                        <div className="search-bar">
                            <div className='search-bar-input'>
                                <input type="text" placeholder="Tìm kiếm" />
                            </div>
                            <div className='search-bar-button-submit'>
                                <button className='search-bar-button'>
                                    <FontAwesomeIcon icon={faSearch} />

                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="list-doctor-body">

                        {doctors.map((doctor, index) => (
                            doctor.doctorInfo.isPermission === false && (
                                <div key={index} className="doctor-item-card">
                                    <div className="doctor-item-info">

                                        <div className="avatar-item-placeholder">
                                            <img src={doctor.avatar} alt="avatar" />
                                        </div>
                                        <div className="doctor-item-details">
                                            <p><strong>Họ và tên:</strong> {doctor.lastName} {doctor.firstName}</p>
                                            <p><strong>Ngày sinh:</strong> {new Date(doctor.dob).toLocaleDateString()}</p>
                                            <p><strong>Chuyên khoa:</strong> {doctor.doctorInfo.specialities.map((speciality, index) => (
                                                <span key={index}>{speciality.name}</span>
                                            ))}</p>
                                            <p><strong>Giới tính:</strong> {doctor.gender===true ? 'Nam' : 'Nữ'}</p>
                                            <p><strong>Số điện thoại:</strong> {doctor.doctorInfo.phone}</p>
                                        </div>

                                        <div className='doctor-item-approve-button'>
                                            {/* <button className="approve-button">Cấp quyền phê duyệt</button> */}
                                            <button className="approve-item-button remove" onClick={() => handlePermission(doctor._id)}>Cấp quyền phê duyệt</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        ))}

                    </div>
                </div>

            </div>
        </div>
    );
}

export default ListDoctor;