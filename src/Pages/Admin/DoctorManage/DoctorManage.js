import './DoctorManage.css';
import DefaultLayoutAdmin from '../../../Layouts/DefaultLayoutAdmin/DefaultLayoutAdmin';
import { SidebarProvider } from '../../../Layouts/DefaultLayoutAdmin/SidebarContext';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import AddDoctor from './AddDoctor';
import { DoctorAPI } from '../../../API/DoctorAPI';
import ListDoctor from './ListDoctor';
import { set } from 'date-fns';
import { toast } from 'react-toastify';
const DoctorManage = () => {
    const [doctors, setDoctors] = useState([])
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [searchDoctor, setSearchDoctor] = useState('');

    const [isAddDoctor, setIsAddDoctor] = useState(false);
    const [isAddPermission, setIsAddPermission] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('all');


    useEffect(() => {

        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await DoctorAPI.getDoctors();
            if (response.status === 200) {
                setDoctors(response.data);
                setFilteredDoctors(response.data);
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const filterDoctors = () => {
            const lowercasedSearch = searchDoctor.toLowerCase();
            const filtered = doctors.filter(doctor => {
                const fullName = `${doctor.lastName} ${doctor.firstName}`.toLowerCase();
                const isApproved = doctor.doctorInfo.isPermission === true;

                return (
                    fullName.includes(lowercasedSearch) &&
                    (selectedFilter === 'all' ||
                        (selectedFilter === 'approved' && isApproved) ||
                        (selectedFilter === 'unapproved' && !isApproved))
                );
            });
            setFilteredDoctors(filtered);
        };

        filterDoctors();
    }, [searchDoctor, doctors, selectedFilter]);

    const handleClickAddDoctor = () => {
        setIsAddDoctor(true);
    }
    const handleCloseIsAddDoctor = () => {
        setIsAddDoctor(false);
    }

    const handleCloseListDoctors = () => {
        setIsAddPermission(false);
        setFilteredDoctors(doctors.filter(doctor => doctor.doctorInfo.isPermission === true));
        fetchDoctors();
    }

    const handleRemovePermission = async (doctorId) => {
        const data = {
            doctorId: doctorId,
            isPermission: false
        };
        try {
            const response = await DoctorAPI.permissionDoctor(data);
            if (response.status === 200) {
                setDoctors(doctors.map(doctor => doctor._id === doctorId ? { ...doctor, doctorInfo: { ...doctor.doctorInfo, isPermission: false } } : doctor));
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleClickAddPermission = () => {
        setIsAddPermission(true);
    }

    const handlePermission = async (doctorId) => {
        const data = {
            doctorId: doctorId,
            isPermission: true
        };
        try {
            const response = await DoctorAPI.permissionDoctor(data);
            if (response.status === 200) {
                toast.success('Cấp quyền thành công');
                setDoctors(doctors.map(doctor => doctor._id === doctorId ? { ...doctor, doctorInfo: { ...doctor.doctorInfo, isPermission: true } } : doctor));
            }
        } catch (error) {
            toast.error('Cấp quyền thất bại');
        }
    }



    return (
        <SidebarProvider>
            <DefaultLayoutAdmin>
                <div className="doctor-manage-body">
                    <div className="doctor-manage-add">
                        <div className="filter-container">
                            <div className="search-icon">
                                <FontAwesomeIcon icon={faSearch} />
                            </div>
                            <select
                                value={selectedFilter}
                                onChange={(e) => setSelectedFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">Tất cả</option>
                                <option value="approved">Đã phê duyệt</option>
                                <option value="unapproved">Chưa phê duyệt</option>
                            </select>
                        </div>
                        <button className="add-button-doctor" onClick={handleClickAddDoctor}>+ Thêm bác sĩ</button>
                    </div>

                    <div className="input-group">
                        <div className='input-group-body'>
                            <input
                                type="text"
                                className="input-search"
                                placeholder="Tìm kiếm bác sĩ"
                                value={searchDoctor}
                                onChange={(e) => setSearchDoctor(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="doctor-list" style={{ marginTop: '20px' }}>
                        {filteredDoctors.length > 0 ? (
                            filteredDoctors.map((doctor, index) => (
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
                                        {doctor.doctorInfo.isPermission ? (
                                            <button
                                                className="approve-button remove"
                                                onClick={() => handleRemovePermission(doctor._id)}
                                            >
                                                Xóa quyền phê duyệt
                                            </button>
                                        ) : (
                                            <button
                                                className="approve-button"
                                                onClick={() => handlePermission(doctor._id)}
                                            >
                                                Cấp quyền phê duyệt
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Không có bác sĩ nào phù hợp với bộ lọc</p>
                        )}
                    </div>
                </div>
            </DefaultLayoutAdmin>
        </SidebarProvider>
    );
};

export default DoctorManage;
