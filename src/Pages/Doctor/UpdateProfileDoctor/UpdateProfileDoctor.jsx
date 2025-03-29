import React, { useEffect, useState } from 'react';
import './UpdateProfileDoctor.css';
import DoctorLayout from '../../../Layouts/Doctor/DoctorLayout';
import { UserAPI } from '../../../API/UserAPI';
import { toast } from 'react-toastify';
import { set } from 'date-fns';
import { DoctorAPI } from '../../../API/DoctorAPI';
const UpdateProfileDoctor = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [avatarFile, setAvatarFile] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const [doctorUpdate, setDoctorUpdate] = useState({
        ...user,
        doctorInfo: {
            ...user.doctorInfo,
            treatment: user.doctorInfo.treatment || '',
            description: user.doctorInfo.description || '',
            phone: user.doctorInfo.phone || '',
        },
    });

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const [avatar, setAvatar] = useState(user.avatar || '');

    // Xử lý chọn ảnh từ thư mục
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setAvatarFile(event.target.files);
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setAvatar(imageUrl);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
            const doctorInfo = {
                treatment: doctorUpdate.doctorInfo.treatment,
                description: doctorUpdate.doctorInfo.description,
                phone: doctorUpdate.doctorInfo.phone,
            };
    
            const formData = new FormData();
            if (avatarFile && avatarFile.length > 0) {
                formData.append('avatar', avatarFile[0]);
            }
            formData.append('firstName', doctorUpdate.firstName);
            formData.append('lastName', doctorUpdate.lastName);
            formData.append('dob', doctorUpdate.dob);
            formData.append('gender', doctorUpdate.gender === 'true');
    
            // Gọi hai API song song
            const [doctorResponse, userResponse] = await Promise.all([
                DoctorAPI.updateDoctorInfo(user._id, doctorInfo),
                UserAPI.updateProfile(formData)
            ]);
    
            // Hợp nhất dữ liệu trả về
            const updatedDoctorInfo = doctorResponse.data;
            const updatedUserInfo = userResponse.data;

    
            // Cập nhật localStorage và state
            const updatedUser = {
                ...user,
                ...updatedUserInfo,
                doctorInfo: {
                    ...updatedDoctorInfo
                },
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setDoctorUpdate(updatedUser);
    
            toast.success('Cập nhật thông tin thành công!');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi cập nhật thông tin.');
        }
    };

    const handleChangePassword = async (event) => {
        event.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu không khớp!');
            return;
        }

        try {
            const response = await UserAPI.changePassword({
                newPassword: newPassword,
            });
            if (response.status === 200) {
                toast.success('Đổi mật khẩu thành công!');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                toast.error('Đổi mật khẩu thất bại!');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi đổi mật khẩu.');
        }
    };


    const formattedDate = doctorUpdate.dob  ? doctorUpdate.dob.split("T")[0] : "";

    return (
        <DoctorLayout>
            <div className="update-profile-container">
                <div className="tabs-update-profile-doctor">
                    <button
                        className={activeTab === 'profile' ? 'active' : ''}
                        onClick={() => setActiveTab('profile')}
                    >
                        Cập nhật hồ sơ
                    </button>
                    <button
                        className={activeTab === 'password' ? 'active' : ''}
                        onClick={() => setActiveTab('password')}
                    >
                        Cập nhật mật khẩu
                    </button>
                </div>

                <div className="tab-content-update-profile-doctor">
                    {activeTab === 'profile' && (
                        <>
                            <div className="profile-form">
                                <div className="profile-left-update-profile-doctor">
                                    <label>Họ và tên lót:</label>
                                    <input type="text" placeholder="Nhập họ và tên lót" value={doctorUpdate.firstName} onChange={(e) => setDoctorUpdate ({ ...doctorUpdate, firstName: e.target.value })} /> 

                                    <label>Tên:</label>
                                    <input type="text" placeholder="Nhập tên" value={doctorUpdate.lastName} onChange={(e) => setDoctorUpdate ({ ...doctorUpdate, lastName: e.target.value })} />

                                    <label>Số điện thoại:</label>
                                    <input type="text" placeholder="Nhập số điện thoại" value={doctorUpdate.doctorInfo.phone} onChange={(e) => setDoctorUpdate ({ ...doctorUpdate, doctorInfo: { ...doctorUpdate.doctorInfo, phone: e.target.value } })} />

                                    <label>Ngày sinh:</label>
                                    <input type="date" placeholder="Nhập ngày sinh" value={formattedDate} onChange={(e) => setDoctorUpdate ({ ...doctorUpdate, dob: e.target.value })} />

                                    <label>Giới tính:</label>
                                    <select value={doctorUpdate.gender} onChange={(e) => setDoctorUpdate({...doctorUpdate, gender:e.target.value})}>
                                        <option value="" disabled hidden>Chọn giới tính</option>
                                        <option value="true">Nam</option>
                                        <option value="false">Nữ</option>

                                    </select>
                                </div>
                                <div className="profile-right-update-profile-doctor">
                                    <div className="avatar-container-update-profile-doctor">
                                        <img src={avatar} alt="Avatar" className="avatar-update-profile-doctor" />
                                        <input
                                            type="file"
                                            accept="/images/*"
                                            onChange={handleImageChange}
                                            className="file-input"
                                            id="avatarUpload"
                                        />
                                        <label htmlFor="avatarUpload" className="upload-button">
                                            Thêm ảnh
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="profile-form-footer-update-profile-doctor">
                                <label>Chuyên trị:</label>
                                <div className="form-textarea-profile">
                                    <textarea placeholder='Nhập chuyên trị' value={doctorUpdate.doctorInfo.treatment} onChange={(e) => setDoctorUpdate ({ ...doctorUpdate, doctorInfo: { ...doctorUpdate.doctorInfo, treatment: e.target.value } })}></textarea>

                                </div>
                                <label>Nhập lý lịch:</label>
                                <div className="form-textarea-profile">
                                    <textarea placeholder='Nhập lý lịch' value={doctorUpdate.doctorInfo.description} onChange={(e) => setDoctorUpdate ({ ...doctorUpdate, doctorInfo: { ...doctorUpdate.doctorInfo, description: e.target.value } })}></textarea>
                                </div>
                            </div>
                            <button type="submit" className="save-button" onClick={handleSubmit}>Lưu thay đổi</button>
                        </>
                    )}
                    {activeTab === 'password' && (
                        <form className="password-form-update-doctor-info">
                            <label>Mật khẩu mới:</label>
                            <input type="password" placeholder="Nhập mật khẩu mới" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

                            <label>Nhập lại mật khẩu mới:</label>
                            <input type="password" placeholder="Xác nhận mật khẩu mới" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                            <button onClick={handleChangePassword} className="save-button">Lưu thay đổi</button>
                        </form>
                    )}
                </div>
            </div>
        </DoctorLayout>
    );
}

export default UpdateProfileDoctor;