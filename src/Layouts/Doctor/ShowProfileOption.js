import { useLocation, useNavigate } from 'react-router-dom';
import './ShowProfileOption.css';
import { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';



const ShowProfileOption = ({ handleCloseShowProfile }) => {
    const navigate = useNavigate();
    const ref = useRef();
    const user = JSON.parse(localStorage.getItem('user'));
    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                handleCloseShowProfile();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [ref, handleCloseShowProfile])
    
    return (
        <div className="show-profile-option" ref={ref} >
            <div className="show-profile-option-info">
                <img src={user.avatar} alt="avatar" />
                <span>{user.firstName} {user.lastName}</span>
            </div>
            <button className="show-profile-option-button" onClick={handleLogout}>
                <FontAwesomeIcon icon={faRightFromBracket} pull='left' />
                Đăng xuất
            </button>
        </div>
    )

}

export default ShowProfileOption;