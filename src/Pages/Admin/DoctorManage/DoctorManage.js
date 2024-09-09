import './DoctorManage.css';
import DefaultLayoutAdmin from '../../../Layouts/DefaultLayoutAdmin/DefaultLayoutAdmin';
import { SidebarProvider } from '../../../Layouts/DefaultLayoutAdmin/SidebarContext';
import { faSearch} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import AddDoctor from './AddDoctor';

const DoctorManage = () => {
    const doctors = [
        {
            name: 'Nguyễn Đức Phú',
            dob: '01/01/2003',
            specialty: 'Răng - Hàm - Mặt',
            position: 'Bác sĩ',
            phone: '0923423523'
        },
        {
            name: 'Nguyễn Đức Phú',
            dob: '01/01/2003',
            specialty: 'Răng - Hàm - Mặt',
            position: 'Bác sĩ',
            phone: '0923423523'
        },
        {
            name: 'Nguyễn Đức Phú',
            dob: '01/01/2003',
            specialty: 'Răng - Hàm - Mặt',
            position: 'Bác sĩ',
            phone: '0923423523'
        }
        // Có thể thêm nhiều bác sĩ khác
    ];

    const [isAddDoctor, setIsAddDoctor] = useState(false);

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
                        <button className="add-button-doctor" onClick={handleClickAddDoctor}>+ Thêm bác sĩ</button>
                    </div>
                    {isAddDoctor && (
                        <AddDoctor handleCloseIsAddDoctor={handleCloseIsAddDoctor} />
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
                        {doctors.map((doctor, index) => (
                            <div key={index} className="doctor-card">
                                <div className="doctor-info">
                                    <div className="avatar-placeholder">
                                        <img src="https://picsum.photos/200/200" alt="avatar" />
                                    </div>
                                    <div className="doctor-details">
                                        <p><strong>Họ và tên:</strong> {doctor.name}</p>
                                        <p><strong>Ngày sinh:</strong> {doctor.dob}</p>
                                        <p><strong>Chuyên khoa:</strong> {doctor.specialty}</p>
                                        <p><strong>Chức danh:</strong> {doctor.position}</p>
                                        <p><strong>Số điện thoại:</strong> {doctor.phone}</p>
                                    </div>
                                </div>
                                <div className='doctor-approve-button'>
                                    <button className="approve-button">Cấp quyền phê duyệt</button>
                                    <button className="approve-button edit">Chỉnh sửa thông tin</button>
                                    <button className="approve-button remove">Xóa</button>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </DefaultLayoutAdmin>
        </SidebarProvider>
    );
};

export default DoctorManage;
