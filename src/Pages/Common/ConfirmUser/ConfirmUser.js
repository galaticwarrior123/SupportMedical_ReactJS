import './ConfirmUser.css';
import LoginRegLayout from '../../../Layouts/LoginLayout/LoginRegLayout';
import { useState } from 'react';
import AuthAPI from '../../../API/AuthAPI';
import { useNavigate } from 'react-router-dom';

const ConfirmUser = () => {
    const [code, setCode] = useState('');
    const navigate = useNavigate();

    const handleSubmit = () => {
        const data = {
            email: localStorage.getItem('email'),
            activeCode: code,
        }
        console.log(data);
        AuthAPI.confirmUser(data)
            .then(res => {
                if (res.status === 201) {
                    alert('Xác nhận thành công');
                    localStorage.removeItem('email');
                    navigate('/login');
                } else {
                    alert('Xác nhận thất bại');
                }
            })
            .catch(err => {
                alert('Xác nhận thất bại');
            })
    }

    return (
        <LoginRegLayout>
            <div className="confirm-user">
                <div className="confirm-user-title">
                    <span> Xác nhận tài khoản</span>
                </div>
                <form>
                    <div className="confirm-user-form-group">
                        <label htmlFor="code">Mã xác nhận</label>
                        <input type="text" id="code" name="code" placeholder="Nhập mã xác nhận" required
                            onChange={(e) => setCode(e.target.value)} />
                    </div>
                    <div className="confirm-user-form-group-button">
                        <button type="button" onClick={handleSubmit}>Xác nhận</button>
                    </div>
                </form>
            </div>
        </LoginRegLayout>
    )
}

export default ConfirmUser;