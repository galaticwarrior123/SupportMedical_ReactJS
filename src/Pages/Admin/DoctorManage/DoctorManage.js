import './DoctorManage.css';
import DefaultLayoutAdmin from '../../../Layouts/DefaultLayoutAdmin/DefaultLayoutAdmin';
import { SidebarProvider } from '../../../Layouts/DefaultLayoutAdmin/SidebarContext';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import AddDoctor from './AddDoctor';
import { DoctorAPI } from '../../../API/DoctorAPI';
import ListDoctor from './ListDoctor';
const DoctorManage = () => {
    const [doctors, setDoctors] = useState([])

    const [isAddDoctor, setIsAddDoctor] = useState(false);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await DoctorAPI.getDoctors();
                if (response.status === 200) {
                    setDoctors(response.data);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        fetchDoctors();
    }, []);

    const handleClickAddDoctor = () => {
        setIsAddDoctor(true);
    }
    const handleCloseIsAddDoctor = () => {
        setIsAddDoctor(false);
    }

    return (
        <SidebarProvider>
            <DefaultLayoutAdmin>
                <div className="doctor-manage-body" >
                    <div className="doctor-manage-add">
                        <button className="add-button-doctor">+ Thêm bác sĩ</button>
                        <button className="add-button-doctor" onClick={handleClickAddDoctor}>+ Thêm bác sĩ</button>
                    </div>
                    {isAddDoctor && (
                        //<AddDoctor handleCloseIsAddDoctor={handleCloseIsAddDoctor} />

                        <ListDoctor doctors={doctors} />
                    )}


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
                    <div className="doctor-list">
                        {doctors.filter(doctor => doctor.doctorInfo.isPermission === true).length > 0 ? (
                            doctors.map((doctor, index) => (
                                doctor.doctorInfo.isPermission === true && (
                                    <div key={index} className="doctor-card">
                                        <div className="doctor-info">
                                            <div className="avatar-placeholder">
                                                <img src={doctor.avatar} alt="avatar" />
                                            </div>
                                            <div className="doctor-details">
                                                <p><strong>Họ và tên:</strong> {doctor.lastName} {doctor.firstName}</p>
                                                <p><strong>Ngày sinh:</strong> {new Date(doctor.dob).toLocaleDateString()}</p>
                                                <p><strong>Chuyên khoa:</strong> {doctor.doctorInfo.specialities.map((speciality, index) => (
                                                    <span key={index}>{speciality.name}</span>
                                                ))}</p>
                                                <p><strong>Số điện thoại:</strong> {doctor.doctorInfo.phone}</p>
                                            </div>
                                        </div>
                                        <div className="doctor-approve-button">
                                            <button className="approve-button remove">Xóa quyền phê duyệt</button>
                                        </div>
                                    </div>
                                )
                            ))
                        ) : (
                            <p>Không có bác sĩ nào được cấp quyền kiểm duyệt</p>
                        )}
                    </div>
                </div>
            </DefaultLayoutAdmin>
        </SidebarProvider>
    );
};

export default DoctorManage;
