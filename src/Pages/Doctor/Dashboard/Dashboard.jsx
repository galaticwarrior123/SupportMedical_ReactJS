import DoctorLayout from "../../../Layouts/Doctor/DoctorLayout";
import AppointmentList from "./AppointmentList";
import './Dashboard.css';
import DashboardHeader from "./DasheboardHeader";

const Dashboard = () => {
    console.log('Doctor Dashboard');
    return (
        <DoctorLayout>
            <DashboardHeader />
            <div className="dashboard-doctor-container">
                <AppointmentList />
            </div>
        </DoctorLayout>
    );
}

export default Dashboard;