import React, { useEffect, useState } from 'react';
import './CreatePost.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faClose, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import PostAPI from '../../../../../API/PostAPI';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { DepartmentAPI } from '../../../../../API/DepartmentAPI';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreatePost = ({ handleCloseFullScreen }) => {
    const [images, setImages] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('all'); // Lưu ID của department hoặc "all"
    const [dropdownOpen, setDropdownOpen] = useState(false);


    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await DepartmentAPI.getAll();
                setDepartments(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchDepartments();
    }, []);

    const handleAddPost = async () => {
        if (title === '' || content === '') {
            toast.error('Tiêu đề và nội dung không được để trống!');
            return;
        }
        const listTag = [];
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('author', user._id);

        if (user.roles.includes('DOCTOR')) {
            formData.append('tags', user.doctorInfo.specialities[0]);
        } else {

            if (selectedDepartment === 'all') {
                // Nếu chọn tất cả, thêm tất cả department
                departments.forEach((department) => { listTag.push(department._id); });
                formData.append('tags', listTag);
            } else {
                // Nếu không, chỉ thêm department đã chọn
                formData.append('tags', selectedDepartment);
            }
        }

        images.forEach((file) => {
            formData.append('images', file);
        });

        try {
            await PostAPI.createPost(formData);
            if (user.roles.includes('DOCTOR')) {
                toast.success('Đăng bài viết thành công!');
            }
            else {
                toast.success('Đăng bài viết thành công! Bài viết của bạn sẽ được duyệt trước khi hiển thị');
            }
            setSelectedDepartment('');
            setImages([]);
            setTitle('');
            setContent('');
            handleCloseFullScreen();
        } catch (error) {
            toast.error('Đăng bài viết thất bại!');
        }
    };

    const handleRadioChange = (e, department) => {
        setSelectedDepartment(department._id); // Lưu ID department
    };

    const handleSelectAll = () => {
        setSelectedDepartment('all'); // Chọn tất cả
    };

    const handleRemoveImage = (indexToRemove) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };

    const handleAddImages = (event) => {
        const newImages = Array.from(event.target.files);
        setImages([...images, ...newImages]);
    };

    const handleAddImage = () => {
        document.getElementById('upload-image').click();
    };

    return (
        <>
            <div className="create-post" onClick={handleCloseFullScreen}>
                <div className="create-post-body" onClick={(e) => e.stopPropagation()}>
                    <div className="create-post-body-title">
                        <p>Tạo bài viết</p>
                        <button onClick={handleCloseFullScreen}>
                            <FontAwesomeIcon icon={faClose} />
                        </button>
                    </div>
                    <div className="create-post-body-header">
                        <div className="create-post-body-header-avatar">
                            <img src={user.avatar} alt="avatar" />
                        </div>
                        <div className="create-post-body-header-name">
                            <p>{user.firstName} {user.lastName}</p>
                        </div>
                    </div>
                    <div className="create-post-body-content">
                        <input type="text" placeholder="Tiêu đề" onChange={(e) => setTitle(e.target.value)} />
                        <textarea placeholder="Nội dung" onChange={(e) => setContent(e.target.value)} />

                        {!user.roles.includes('DOCTOR') && (
                            <div className="create-post-body-content-checkbox">
                                <p>Chọn chủ đề:</p>
                                <div className="create-post-body-content-checkbox-list">
                                    <select className="create-post-body-content-checkbox-list-select" onChange={(e) => setSelectedDepartment(e.target.value)}>
                                        {/* <option value={"all"}>Tất cả</option> */}
                                        {departments.map((department) => (
                                            <option key={department._id} value={department._id}>{department.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        <p>Thêm ảnh:</p>
                        <div className="create-post-body-listImage">
                            {images.length === 0 && <p>Chưa có ảnh nào được thêm vào</p>}
                            {images.map((image, index) => (
                                <div key={index} className="image-item">
                                    <img src={URL.createObjectURL(image)} alt={`Preview ${index + 1}`} />
                                    <button className="delete-button" onClick={() => handleRemoveImage(index)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="create-post-body-content-listImage-addImage">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleAddImages}
                                id="upload-image"
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="upload-image">
                                <button type="button" onClick={handleAddImage}>Thêm ảnh</button>
                            </label>
                        </div>
                    </div>
                    <div className="create-post-body-footer">
                        <div className="create-post-body-footer-button">
                            <button onClick={handleAddPost}>Đăng</button>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

export default CreatePost;
