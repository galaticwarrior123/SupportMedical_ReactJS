import './ListDoctor.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faX } from '@fortawesome/free-solid-svg-icons';
import { DoctorAPI } from '../../../API/DoctorAPI';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { set } from 'date-fns';
import { useState, useEffect } from 'react';
const ListDoctor = ({ doctors }) => {
    const [listDoctor, setListDoctor] = useState(doctors);
    const [searchDoctor, setSearchDoctor] = useState('');
    const [filteredDoctors, setFilteredDoctors] = useState(doctors);

    useEffect(() => {
        setFilteredDoctors(
            listDoctor.filter(doctor =>
                // Kiểm tra cả họ và tên
                `${doctor.lastName} ${doctor.firstName}`.toLowerCase().includes(searchDoctor.toLowerCase())
            )
        );
    }, [searchDoctor, listDoctor]);


    const handlePermission = async (doctorId) => {
        const data = {
            doctorId: doctorId,
            isPermission: true
        };
        try {
            const response = await DoctorAPI.permissionDoctor(data);
            if (response.status === 200) {
                toast.success('Cấp quyền thành công');
                setListDoctor(listDoctor.map(doctor => doctor._id === doctorId ? { ...doctor, doctorInfo: { ...doctor.doctorInfo, isPermission: true } } : doctor));
            }
        } catch (error) {
            toast.error('Cấp quyền thất bại');
        }
    }

    const handleRemovePermission = async (doctorId) => {
        const data = {
            doctorId: doctorId,
            isPermission: false
        };
        try {
            const response = await DoctorAPI.permissionDoctor(data);
            if (response.status === 200) {
                toast.success('Xóa quyền thành công');
                setListDoctor(listDoctor.map(doctor => doctor._id === doctorId ? { ...doctor, doctorInfo: { ...doctor.doctorInfo, isPermission: false } } : doctor));
            }
        } catch (error) {
            toast.error('Xóa quyền thất bại');
        }
    }
    const handleCloseIsAddDoctor = () => {  
        window.location.reload();
    }
    return (
        <div className="list-doctor">
            <ToastContainer />
            <div className="list-doctor-overlay">
                <div className="list-doctor-overlay-body">
                    <div className="list-doctor-header">
                        <span>Danh sách bác sĩ</span>
                        <div className="list-doctor-close">
                            <button className="close-button" onClick={handleCloseIsAddDoctor}>
                                <FontAwesomeIcon icon={faX} />
                            </button>
                        </div>
                    </div>
                    <div className="list-doctor-search" style={{ marginTop: 10, marginLeft: 10 }}>
                        <div className="search-bar">
                            <div className='search-bar-input'>
                                <input type="text" placeholder="Tìm kiếm tên bác sĩ" value={searchDoctor} onChange={(e) => setSearchDoctor(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="list-doctor-body">
                        {filteredDoctors.length > 0 ? (
                            filteredDoctors.map((doctor, index) => (

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
                                            <p><strong>Giới tính:</strong> {doctor.gender === true ? 'Nam' : 'Nữ'}</p>
                                            <p><strong>Số điện thoại:</strong> {doctor.doctorInfo.phone}</p>
                                        </div>

                                        <div className='doctor-item-approve-button'>
                                            
                                            {/* <button className="approve-button">Cấp quyền phê duyệt</button> */}
                                            {doctor.doctorInfo.isPermission === false ? (
                                                <button className="approve-button" onClick={() => handlePermission(doctor._id)}>Cấp quyền phê duyệt</button>
                                            ) : (
                                                <button className="approve-button remove" onClick={() => handleRemovePermission(doctor._id)}>Xóa quyền phê duyệt</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                            )) : (
                            <p>Không có bác sĩ nào</p>
                        )
                        }

                    </div>
                </div>

            </div>
        </div>
    );
}

export default ListDoctor;