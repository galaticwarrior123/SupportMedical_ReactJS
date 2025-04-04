import { useSelector } from 'react-redux';
import BgDoctor from '../../../assets/images/bg-doctor.svg';
import { useAuth } from '../../../context/AuthProvider';

const DashboardHeader = () => {
    const { user } = useAuth();
    const { appointments } = useSelector((state) => state.doctorDashboard);
    return (
        <div className="dashboard-header" style={{ backgroundImage: `url(${BgDoctor})` }}>
            <div className="dashboard-header-content">
                <h1>Xin chào, bác sĩ {user.lastName}</h1>
                <p>Hôm nay bạn còn <span className='number-patient'>{appointments?.length}</span> bệnh nhân chờ bạn khám!</p>
            </div>
        </div>
    );
}

export default DashboardHeader;