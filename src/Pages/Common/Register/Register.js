import LoginRegLayout from '../../../Layouts/LoginLayout/LoginRegLayout';
import './Register.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthAPI from '../../../API/AuthAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { set } from 'date-fns';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const [maxDate, setMaxDate] = useState('');

    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        setMaxDate(`${year}-${month}-${day}`);
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleRePasswordVisibility = () => {
        setShowRePassword(!showRePassword);
    };

    const handleRegister = (e) => {
        if (!firstName || !lastName || !email || !dob || !gender || !password || !rePassword) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Email không hợp lệ.');
            return;
        }

        if (password !== rePassword) {
            toast.error('Mật khẩu không khớp');
            return;
        }

        const data = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            dob: new Date(dob).toISOString().split('T')[0],
            gender: gender === 'Male' ? true : false,
            password: password,
        }

        try {
            console.log(data);
            AuthAPI.register(data)
                .then(res => {
                    if (res.data.isActive === false) {
                        localStorage.setItem('email', email);
                        setFirstName('');
                        setLastName('');
                        setEmail('');
                        setDob('');
                        setGender('');
                        setPassword('');
                        setRePassword('');
                        navigate('/register/confirm-user');
                    } else {
                        toast.error('Đăng ký thất bại');
                    }

                })
        } catch (error) {
            toast.error('Đăng ký thất bại');
        }
    }
    return (
        <LoginRegLayout>
            <ToastContainer />
            <div className="register">
                <div className="register-title">
                    <span> Đăng ký</span>
                </div>
                <form>
                    <div className="register-form-group">
                        <label htmlFor="FirstName">Họ và tên lót</label>
                        <input type="text" id="FirstName" name="FirstName" placeholder="Nhập họ và tên lót" required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="register-form-group">
                        <label htmlFor="LastName">Tên</label>
                        <input type="text" id="LastName" name="LastName" placeholder="Nhập tên" required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div className="register-form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="Nhập email" required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="register-form-group">
                        <label htmlFor="sex">Giới tính</label>

                        <div className="register-form-group-radio">
                            <div className="radio">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Male"
                                    onChange={(e) => setGender(e.target.value)}
                                />
                                <label htmlFor="Male">Nam</label>
                            </div>

                            <div className="radio">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Female"
                                    onChange={(e) => setGender(e.target.value)}
                                />
                                <label htmlFor="Female">Nữ</label>
                            </div>
                        </div>
                    </div>
                    <div className="register-form-group">
                        <label htmlFor="date">Ngày sinh</label>
                        <input type="date" id="date" name="date" max={maxDate} required
                            value={dob}
                            onChange={(e) => setDob(e.target.value)} />
                    </div>
                    <div className="register-form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                placeholder="Nhập mật khẩu"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <FontAwesomeIcon
                                icon={showPassword ? faEyeSlash : faEye}
                                className="password-icon"
                                onClick={togglePasswordVisibility}
                            />
                        </div>
                    </div>
                    <div className="register-form-group">
                        <label htmlFor="re-password">Nhập lại mật khẩu</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showRePassword ? 'text' : 'password'}
                                id="re-password"
                                name="re-password"
                                placeholder="Nhập lại mật khẩu"
                                required
                                value={rePassword}
                                onChange={(e) => setRePassword(e.target.value)}
                            />
                            <FontAwesomeIcon
                                icon={showRePassword ? faEyeSlash : faEye}
                                className="password-icon"
                                onClick={toggleRePasswordVisibility}
                            />
                        </div>
                    </div>
                    <div className="register-form-group-button">
                        <button type="button" onClick={handleRegister}>Đăng ký</button>
                    </div>
                </form>
                <div className="register-form-line">
                    <div className="line"></div>
                </div>
                <div className="register-form-login">
                    <span>Bạn đã có tài khoản? <a href="/login">Đăng nhập</a></span>
                </div>
            </div>
        </LoginRegLayout>

    )
}

export default Register;