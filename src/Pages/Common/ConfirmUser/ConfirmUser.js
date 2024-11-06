import './ConfirmUser.css';
import LoginRegLayout from '../../../Layouts/LoginLayout/LoginRegLayout';
import { useState } from 'react';
import AuthAPI from '../../../API/AuthAPI';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useLoading } from '../../../context/LoadingProvider';
const ConfirmUser = () => {
    const { setLoading } = useLoading();
    const [code, setCode] = useState('');
    const navigate = useNavigate();

    const handleSubmit = () => {
        const data = {
            email: localStorage.getItem('email'),
            activeCode: code,
        }
        setLoading(true);
        AuthAPI.confirmUser(data)
            .then(res => {
                if (res.status === 201) {
                    toast.success('Xác nhận thành công');
                    localStorage.removeItem('email');
                    setCode('');
                    navigate('/login');
                } else {
                    toast.error('Xác nhận thất bại');
                }
            })
            .catch(err => {
                toast.error('Xác nhận thất bại');
            });
        setLoading(false);
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
                            value={code}
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