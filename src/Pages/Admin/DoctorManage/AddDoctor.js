import './AddDoctor.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { DoctorAPI } from '../../../API/DoctorAPI';
import { DepartmentAPI } from '../../../API/DepartmentAPI';
import { fi, se, tr } from 'date-fns/locale';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddDoctor = ({ handleCloseIsAddDoctor }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [fileImage, setFileImage] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [doctorFirstName, setDoctorFirstName] = useState("");
    const [doctorLastName, setDoctorLastName] = useState("");
    const [doctorPhone, setDoctorPhone] = useState("");
    const [doctorEmail, setDoctorEmail] = useState("");
    const [doctorDob, setDoctorDob] = useState(new Date().toISOString().split('T')[0]);
    const [doctorGender, setDoctorGender] = useState(true);
    const [doctorSpecialty, setDoctorSpecialty] = useState("");

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await DepartmentAPI.getAll();
                setDepartments(response.data);
            } catch (error) {
                toast.error("Lỗi khi lấy dữ liệu từ server");
            }
        };
        fetchDepartments();
    }, []);

    // Hàm xử lý khi người dùng chọn ảnh
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFileImage(e.target.files);
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setSelectedImage(imageURL);
        }
    };

    const handleAddDoctor = async () => {
        if (!doctorFirstName || !doctorLastName || !doctorPhone || !doctorEmail || !doctorDob || !doctorSpecialty) {
            toast.error("Vui lòng điền đầy đủ thông tin");
            return;
        }


        try {
            // Tạo đối tượng FormData để chứa dữ liệu
            const formData = new FormData();
            formData.append("firstName", doctorFirstName);
            formData.append("lastName", doctorLastName);
            formData.append("phone", doctorPhone);
            formData.append("email", doctorEmail);
            formData.append("dob", doctorDob);
            formData.append("gender", doctorGender);  // Giới tính có thể là chuỗi 'Male' hoặc 'Female'
            formData.append("specialty", doctorSpecialty);
    
            // Nếu có ảnh, thêm ảnh vào formData
            if (fileImage) {
                formData.append("avatar", fileImage[0]);
                console.log("ảnh đã được thêm vào formData");
            }
            else {
                console.log("Không có ảnh");
            }
    
            // Gửi yêu cầu lên server
            await DoctorAPI.createDoctor(formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',  // Đảm bảo đúng kiểu dữ liệu
                },
            });
    
            // Reset form sau khi thêm thành công
            setSelectedImage(null);
            setDoctorFirstName("");
            setDoctorLastName("");
            setDoctorPhone("");
            setDoctorEmail("");
            setDoctorDob(new Date().toISOString().split('T')[0]);
            setDoctorGender(true);
            setDoctorSpecialty("");
            handleCloseIsAddDoctor();
    
            toast.success("Thêm bác sĩ thành công");
        } catch (error) {
            toast.error("Lỗi khi thêm bác sĩ");
            console.error(error);
        }
    };
    
    return (
        <div className="doctor-manage-add-person" >
            <ToastContainer />
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
                                <input type="text" placeholder="Họ và tên lót" value={doctorFirstName} onChange={(e) => setDoctorFirstName(e.target.value)} />
                            </div>
                            <div className="doctor-manage-add-person-input">
                                <label>Tên</label>
                                <input type="text" placeholder="Tên" value={doctorLastName} onChange={(e) => setDoctorLastName(e.target.value)} />
                            </div>
                            <div className="doctor-manage-add-person-input">
                                <label>Số điện thoại</label>
                                <input type="text" placeholder="Số điện thoại" value={doctorPhone} onChange={(e) => setDoctorPhone(e.target.value)} />
                            </div>
                            <div className="doctor-manage-add-person-input">
                                <label>Email</label>
                                <input type="email" placeholder="Email" value={doctorEmail} onChange={(e) => setDoctorEmail(e.target.value)} />
                            </div>
                            <div className="doctor-manage-add-person-input">
                                <label>Ngày sinh</label>
                                <input type="date" placeholder="Ngày sinh" value={doctorDob} onChange={(e) => setDoctorDob(e.target.value)} />
                            </div>
                            <div className="doctor-manage-add-person-input">
                                <label>Giới tính</label>
                                <div className="doctor-manage-add-person-group-radio">
                                    <div className="radio">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={true}
                                            onChange={(e) => setDoctorGender(e.target.value)}
                                        />
                                        <label htmlFor="Male">Nam</label>
                                    </div>

                                    <div className="radio">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={false}
                                            onChange={(e) => setDoctorGender(e.target.value)}
                                        />
                                        <label htmlFor="Female">Nữ</label>
                                    </div>
                                </div>
                            </div>
                            <div className="doctor-manage-add-person-input">
                                <label>Chuyên khoa</label>
                                <select name="specialty" id="specialty" value={doctorSpecialty} onChange={(e) => setDoctorSpecialty(e.target.value)}>
                                    <option value="" disabled>Chọn chuyên khoa</option>
                                    {departments.map((department) => (
                                        <option key={department.id} value={department._id}>
                                            {department.name}
                                        </option>
                                    ))}


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
                                        src={selectedImage || "https://via.placeholder.com/150"}
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
                        <button className="add-button" onClick={handleAddDoctor}>Thêm</button>
                    </div>
                </div>

            </div>

        </div>
    )

}

export default AddDoctor;