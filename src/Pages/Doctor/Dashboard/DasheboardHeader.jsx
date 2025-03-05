import BgDoctor from '../../../assets/images/bg-doctor.svg';

const DashboardHeader = () => {
    return (
        <div className="dashboard-header" style={{ backgroundImage: `url(${BgDoctor})` }}>
            <div className="dashboard-header-content">
                <h1>Xin chào, bác sĩ Phú</h1>
                <p>Hôm nay bạn còn 3 bệnh nhân chờ bạn khám!</p>
            </div>
        </div>
    );
}

export default DashboardHeader;