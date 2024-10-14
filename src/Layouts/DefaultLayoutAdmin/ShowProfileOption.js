import { useLocation, useNavigate } from 'react-router-dom';
import './ShowProfileOption.css';


const ShowProfileOption = ({ handleCloseShowProfile }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    }
    return (
        <div className="show-profile-option">
            <div className="show-profile-option-info">
                <img src={user.avatar} alt="avatar" />
                <span>{user.firstName} {user.lastName}</span>
            </div>
            <button className="show-profile-option-button" onClick={handleLogout}>Đăng xuất</button>
        </div>
    )

}

export default ShowProfileOption;