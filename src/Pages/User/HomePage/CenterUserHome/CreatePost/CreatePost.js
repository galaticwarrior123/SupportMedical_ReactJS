import React, { useState } from 'react';
import './CreatePost.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faClose } from '@fortawesome/free-solid-svg-icons';
import PostAPI from '../../../../../API/PostAPI';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

const CreatePost = ({ handleCloseFullScreen }) => {
    const [images, setImages] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));

    const handleAddPost = async () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        console.log(images);
        // Thêm từng tệp tin vào FormData
        images.forEach((file) => {
            formData.append('images', file); // 'images' là key trong FormData
        });
        try {
            await PostAPI.createPost(formData)
            .then((res) => {
                toast.success('Đăng bài viết thành công!');
                handleCloseFullScreen();
            });
        } catch (error) {
            toast.error('Đăng bài viết thất bại!');
        }
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
    }

    



    return (
        <div className="create-post" onClick={handleCloseFullScreen}>
            <ToastContainer style={{ position: 'absolute', top: 60, right: 40 }} />
            <div className="create-post-body" onClick={(e) => e.stopPropagation()}>
                <div className="create-post-body-title">
                    <p>Tạo bài viết</p>
                    <button onClick={handleCloseFullScreen}>
                        <FontAwesomeIcon icon={faClose} />
                    </button>
                </div>
                <div className="create-post-body-header">
                    <div className="create-post-body-header-avatar">
                        <img src="https://via.placeholder.com/50" alt="avatar" />
                    </div>
                    <div className="create-post-body-header-name">
                        <p>{user.firstName} {user.lastName}</p>
                    </div>
                </div>
                <div className="create-post-body-content">
                    <input type="text" placeholder="Tiêu đề" onChange={(e) => setTitle(e.target.value)} />
                    <textarea placeholder="Nội dung" onChange={(e) => setContent(e.target.value)} />
                    <div className="create-post-body-listImage">
                        {images.length === 0 && <p>Chưa có ảnh nào được thêm vào</p>}
                        {images.map((image, index) => (
                            <div key={index} className="image-item">
                                <span className="image-name">{image.name}</span>
                                <button
                                    className="delete-button"
                                    onClick={() => handleRemoveImage(index)}
                                >
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
                            style={{ display: 'none' }} // Hide the actual input
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
    );
};

export default CreatePost;
