import React, { useState } from 'react';
import './CreatePost.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faClose} from '@fortawesome/free-solid-svg-icons';

const CreatePost = ({ handleCloseFullScreen }) => {
    const [images, setImages] = useState([
        // Initial images if any
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
    ]);

    const handleRemoveImage = (indexToRemove) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };

    const handleAddImages = (event) => {
        const newImages = Array.from(event.target.files).map(file => URL.createObjectURL(file));
        setImages([...images, ...newImages]);
    };

    const handleAddImage = () => {
        document.getElementById('upload-image').click();
    }

    return (
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
                        <img src="https://via.placeholder.com/50" alt="avatar" />
                    </div>
                    <div className="create-post-body-header-name">
                        <p>Nguyễn Văn A</p>
                    </div>
                </div>
                <div className="create-post-body-content">
                    <input type="text" placeholder="Tiêu đề" />
                    <textarea placeholder="Nội dung"></textarea>
                    <div className="create-post-body-listImage">
                        {images.length === 0 && <p>Chưa có ảnh nào được thêm vào</p>}
                        {images.map((image, index) => (
                            <div key={index} className="image-item">
                                <span className="image-name">{image}</span>
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
                        <button>Đăng</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
