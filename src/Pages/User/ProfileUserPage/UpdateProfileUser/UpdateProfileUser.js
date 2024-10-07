import './UpdateProfileUser.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { UserAPI } from '../../../../API/UserAPI';
import { set } from 'date-fns';
import { da } from 'date-fns/locale';
const UpdateProfileUser = ({ handleCloseUpdateProfile, fetchByUserId, onUserUpdate }) => {
    const [selectedImage, setSelectedImage] = useState(JSON.parse(localStorage.getItem('user')).avatar || null);
    const [fileImage, setFileImage] = useState(null);
    const [userUpdate, setUserUpdate] = useState(JSON.parse(localStorage.getItem('user')));

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFileImage(e.target.files);
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setSelectedImage(imageURL);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const formData = new FormData();
    
            // Thêm các trường từ userUpdate vào formData, ngoại trừ 'avatar'
            for (const key in userUpdate) {
                if (userUpdate.hasOwnProperty(key) && key !== 'avatar') {
                    formData.append(key, userUpdate[key]);
                }
            }
    
            // Kiểm tra nếu người dùng có chọn ảnh mới, thì upload file mới
            if (fileImage && fileImage[0]) {
                formData.append('avatar', fileImage[0]); // Thêm ảnh mới nếu có
            }
    
            const response = await UserAPI.updateProfile(formData);
    
            if (response.status === 200) {
                localStorage.setItem('user', JSON.stringify(response.data));
                setUserUpdate(response.data);
                onUserUpdate(response.data);
                fetchByUserId();
                handleCloseUpdateProfile();
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    };
    
    return (
        <div className="update-profile-user" >
            <div className="update-profile-user-overlay">
                <div className="update-profile-user-body">
                    <div className="update-profile-user-header">
                        <span>Cập nhật thông tin</span>
                    </div>
                    <div className='update-profile-user-close'>
                        <button className="close-button" onClick={handleCloseUpdateProfile}>
                            <FontAwesomeIcon icon={faX} />
                        </button>
                    </div>
                    <div className='update-profile-user-body-containter'>
                        <div className='doctormanage-add-person-body-containter-form'>
                            <div className="update-profile-user-input">
                                <label>Họ và tên lót</label>
                                <input type="text" placeholder="Họ và tên lót" value={userUpdate.firstName} onChange={(e) => setUserUpdate({ ...userUpdate, firstName: e.target.value })} />
                            </div>
                            <div className="update-profile-user-input">
                                <label>Tên</label>
                                <input type="text" placeholder="Tên" value={userUpdate.lastName} onChange={(e) => setUserUpdate({ ...userUpdate, lastName: e.target.value })} />
                            </div>
                            {/* <div className="update-profile-user-input">
                                <label>Số điện thoại</label>
                                <input type="text" placeholder="Số điện thoại" />
                            </div> */}
                            <div className="update-profile-user-input">
                                <label>Email</label>
                                <input type="email" placeholder="Email" value={userUpdate.email} onChange={(e) => setUserUpdate({ ...userUpdate, email: e.target.value })} disabled />
                            </div>
                            <div className="update-profile-user-input">
                                <label>Ngày sinh</label>
                                <input type="date" placeholder="Ngày sinh"
                                    value={userUpdate.dob ? new Date(userUpdate.dob).toISOString().split('T')[0] : ''}
                                    onChange={(e) => setUserUpdate({ ...userUpdate, dob: e.target.value })} />
                            </div>
                            <div className="update-profile-user-input">
                                <label>Giới tính</label>
                                <div className="update-profile-user-group-radio">
                                    <div className="radio">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="true"
                                            checked={userUpdate.gender === true} // Kiểm tra nếu giá trị là true
                                            onChange={() => setUserUpdate({ ...userUpdate, gender: true })} // Cập nhật gender thành true (Nam)
                                        />
                                        <label htmlFor="Male">Nam</label>
                                    </div>

                                    <div className="radio">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="false"
                                            checked={userUpdate.gender === false} // Kiểm tra nếu giá trị là false
                                            onChange={() => setUserUpdate({ ...userUpdate, gender: false })} // Cập nhật gender thành false (Nữ)
                                        />
                                        <label htmlFor="Female">Nữ</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="update-profile-user-load-image">
                            <div className="update-profile-user-load-image-body">
                                <div className="update-profile-user-load-image-header">
                                    <span>Chọn ảnh đại diện</span>
                                </div>
                                <div className="update-profile-user-load-image-body-placeholder">
                                    <img
                                        src={selectedImage || "https://picsum.photos/200/200"}
                                        alt="avatar"
                                        className="preview-image"
                                    />
                                </div>
                                <div className="update-profile-user-load-image-body-button">
                                    <label htmlFor="fileInput" className="add-button">Chọn ảnh  </label>
                                    <input
                                        id="fileInput"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="update-profile-user-button-action">
                        <button className="add-button" onClick={handleUpdateProfile}>Cập nhật</button>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default UpdateProfileUser;