import LoginRegLayout from '../../../Layouts/LoginLayout/LoginRegLayout';
import './Login.css';
import AuthAPI from '../../../API/AuthAPI';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async () => {
        if (!email || !password) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        const data = {
            email: email,
            password: password
        }
        try {
            const response = await AuthAPI.login(data);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('roles', JSON.stringify(response.data.user.roles));
            toast.success('Đăng nhập thành công');
            navigate('/');
        } catch (error) {
            toast.error(error.response.data.message);
        }

    }

    
    return (
        <LoginRegLayout>
            <ToastContainer />
            <div className="login">
                <div className="login-title">
                    <span> Đăng nhập</span>
                </div>
                <form>
                    <div className="login-form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="Nhập email" required
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="login-form-group ">
                        <label htmlFor="password">Mật khẩu</label>

                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                placeholder="Nhập mật khẩu"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <FontAwesomeIcon
                                icon={showPassword ? faEyeSlash : faEye}
                                onClick={togglePasswordVisibility}
                                className="password-icon"
                            />
                        </div>

                    </div>
                    {/* <div className="login-form-group-checkbox">
                        <input type="checkbox" id="remember" name="remember" />
                        <label htmlFor="remember">Ghi nhớ đăng nhập</label>
                    </div> */}
                    <div className="login-form-group-button">
                        <button type="button" onClick={handleLogin}>Đăng nhập</button>
                    </div>
                </form>
                <div className="login-forgot-password">
                    <a href="/forgot-password">Quên mật khẩu?</a>
                </div>
                <div className="login-form-line">
                    <div className="line"></div>
                </div>
                <div className="login-form-register">
                    <span>Bạn chưa có tài khoản? <a href="/register">Đăng ký</a></span>
                </div>
            </div>
        </LoginRegLayout>
    )
}

export default Login;