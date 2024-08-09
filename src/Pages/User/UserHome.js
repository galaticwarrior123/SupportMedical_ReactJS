import { useNavigate } from 'react-router-dom';

const UserHome = () => {
    const navigate = useNavigate();
    const handleLogOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    }
    return (
        <>
            <div>
                <h1>User Home</h1>
            </div>
            <button onClick={handleLogOut}>Đăng xuất</button>
        </>

    );
}

export default UserHome;