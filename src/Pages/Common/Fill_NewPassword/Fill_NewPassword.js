import './Fill_NewPassword.css';
import LoginRegLayout from '../../../Layouts/LoginLayout/LoginRegLayout';
import AuthAPI from '../../../API/AuthAPI';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
const Fill_NewPassword = () => {
    const [password, setPassword] = useState('');
    const [activeCode, setActiveCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = () => {
        if (!password || !activeCode) {
            alert('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        const data = {
            email: localStorage.getItem('email'),
            password: password,
            activeCode: activeCode
        }

        AuthAPI.resetPassword(data)
            .then(res => {
                if (res.status === 201) {
                    navigate('/login');
                }
                else {
                    toast.error('Đặt lại mật khẩu thất bại');
                }
            })
            .catch(err => {
                toast.error('Đặt lại mật khẩu thất bại');
            })

    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <LoginRegLayout>
            <div className="fill-new-password">
                <div className="fill-new-password-title">
                    <span> Đặt lại mật khẩu</span>
                </div>
                <div className="fill-new-password-des">
                    <span>Hãy nhập mật khẩu mới của bạn</span>
                </div>
                <form>
                    
                    <div className="fill-new-password-form-group">
                        <label htmlFor="password">Nhập mật khẩu mới</label>
                        <div className='fill-new-password-wrapper'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                placeholder="Nhập mật khẩu mới"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <FontAwesomeIcon
                                icon={showPassword ? faEyeSlash : faEye}
                                onClick={togglePasswordVisibility}
                                className="password-icon"
                            />
                        </div>
                    </div>
                    <div className="fill-new-password-form-group">
                        <label htmlFor="active-code">Nhập mã xác nhận</label>
                        <input type="text" id="active-code" name="active-code" placeholder="Nhập mã xác nhận" value={activeCode} onChange={(e) => setActiveCode(e.target.value)} />
                    </div>
                    <div className="fill-new-password-form-group-button">
                        <button type="button" onClick={handleSubmit}>Xác nhận</button>
                    </div>
                </form>

                <div className="fill-new-password-back">
                    <span>Quay lại</span>
                    <a href="/login">Đăng nhập</a>
                </div>
            </div>
        </LoginRegLayout>

    )
}

export default Fill_NewPassword;