import './AddDoctor.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
const AddDoctor = ({ handleCloseIsAddDoctor }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    // Hàm xử lý khi người dùng chọn ảnh
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setSelectedImage(imageURL);
        }
    };
    return (
        <div className="doctor-manage-add-person" >
            <div className="doctor-manage-add-person-overlay">
                <div className="doctor-manage-add-person-body">
                    <div className="doctor-manage-add-person-header">
                        <span>Thêm bác sĩ</span>
                    </div>
                    <div className='doctor-manage-add-person-close'>
                        <button className="close-button" onClick={handleCloseIsAddDoctor}>
                            <FontAwesomeIcon icon={faX} />
                        </button>
                    </div>
                    <div className='doctor-manage-add-person-body-containter'>
                        <div className='doctormanage-add-person-body-containter-form'>
                            <div className="doctor-manage-add-person-input">
                                <label>Họ và tên lót</label>
                                <input type="text" placeholder="Họ và tên lót" />
                            </div>
                            <div className="doctor-manage-add-person-input">
                                <label>Tên</label>
                                <input type="text" placeholder="Tên" />
                            </div>
                            <div className="doctor-manage-add-person-input">
                                <label>Số điện thoại</label>
                                <input type="text" placeholder="Số điện thoại" />
                            </div>
                            <div className="doctor-manage-add-person-input">
                                <label>Email</label>
                                <input type="email" placeholder="Email" />
                            </div>
                            <div className="doctor-manage-add-person-input">
                                <label>Ngày sinh</label>
                                <input type="date" placeholder="Ngày sinh" />
                            </div>
                            <div className="doctor-manage-add-person-input">
                                <label>Giới tính</label>
                                <div className="doctor-manage-add-person-group-radio">
                                    <div className="radio">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="Male"
                                        // onChange={(e) => setGender(e.target.value)}
                                        />
                                        <label htmlFor="Male">Nam</label>
                                    </div>

                                    <div className="radio">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="Female"
                                        // onChange={(e) => setGender(e.target.value)}
                                        />
                                        <label htmlFor="Female">Nữ</label>
                                    </div>
                                </div>
                            </div>
                            <div className="doctor-manage-add-person-input">
                                <label>Chuyên khoa</label>
                                <select name="specialty" id="specialty">
                                    <option value="Răng - Hàm - Mặt">Răng - Hàm - Mặt</option>
                                    <option value="Da liễu">Da liễu</option>
                                    <option value="Tim mạch">Tim mạch</option>
                                    <option value="Nhi">Nhi</option>
                                    <option value="Tai mũi họng">Tai mũi họng</option>
                                </select>
                            </div>
                            <div className="doctor-manage-add-person-input">
                                <label>Chức danh</label>
                                <select name="position" id="position">
                                    <option value="Bác sĩ">Bác sĩ</option>
                                    <option value="Y tá">Y tá</option>
                                    <option value="Chuyên gia">Chuyên gia</option>
                                </select>
                            </div>
                        </div>
                        <div className="doctor-manage-add-person-load-image">
                            <div className="doctor-manage-add-person-load-image-body">
                                <div className="doctor-manage-add-person-load-image-header">
                                    <span>Chọn ảnh đại diện</span>
                                </div>
                                <div className="doctor-manage-add-person-load-image-body-placeholder">
                                    <img
                                        src={selectedImage || "https://picsum.photos/200/200"}
                                        alt="avatar"
                                        className="preview-image"
                                    />
                                </div>
                                <div className="doctor-manage-add-person-load-image-body-button">
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
                    <div className="doctor-manage-add-person-button-action">
                        <button className="add-button">Thêm</button>
                    </div>
                </div>

            </div>

        </div>
    )

}

export default AddDoctor;