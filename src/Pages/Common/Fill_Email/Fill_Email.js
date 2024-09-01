import LoginRegLayout from '../../../Layouts/LoginLayout/LoginRegLayout';
import './Fill_Email.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthAPI from '../../../API/AuthAPI';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const Fill_Email = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const [notice, setNotice] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(true);

    const handleSubmit = () => {
        if (!email) {
            toast('Vui lòng nhập email');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast('Email không hợp lệ');
            return;
        }

        const data = {
            email: email
        }
        AuthAPI.forgotPassword(data)
            .then(res => {
                if (res.status === 404) {
                    alert('Email không tồn tại');
                }
                else {
                    setNotice(true);
                    setShowEmailForm(false);
                }
            })
            .catch(err => {
                alert('Gửi thất bại');
            })

    }

    const handleFillNewPassword = () => {
        navigate('/reset-password');
    }
    
    const renderNotice = () => {
        return (
            <div className="fill-email-notice">
                <div className="fill-email-notice-title">
                    <span>Thông báo</span>
                </div>
                <div className="fill-email-notice-des">
                    <span>Mã xác nhận đã gửi đến email của bạn</span>
                </div>
                <form>
                    <div className="fill-email-notice-form-group-button">
                        <button onClick={handleFillNewPassword}>Tiếp tục</button>
                    </div>
                </form>
            </div>

        )
    }
    return (
        <LoginRegLayout>
            {showEmailForm && (
                <div className="fill-email">
                    <div className="fill-email-title">
                        <span>Nhập email của bạn</span>
                    </div>
                    <div className="fill-email-des">
                        <span>Hãy nhập email của bạn để nhận mã xác nhận</span>
                    </div>
                    <form>
                        <div className="fill-email-form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Nhập email"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="fill-email-form-group-button">
                            <button type="button" onClick={handleSubmit}>Gửi mã</button>
                        </div>
                    </form>
                    <div className="fill-email-back">
                        <span>
                            Quay lại <a href="/login">Đăng nhập</a>
                        </span>
                    </div>
                </div>
            )}
            {notice && renderNotice()}
        </LoginRegLayout>

    )
}

export default Fill_Email;