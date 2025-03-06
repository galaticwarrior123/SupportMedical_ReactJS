import DoctorLayout from "../../../Layouts/Doctor/DoctorLayout";
import AppointmentList from "./AppointmentList";
import './Dashboard.css';
import DashboardHeader from "./DasheboardHeader";
import PatientCard from "./PatientCard";

const Dashboard = () => {
    console.log('Doctor Dashboard');
    return (
        <DoctorLayout>
            <DashboardHeader />
            <div className="dashboard-doctor-container">
                <AppointmentList />
                <PatientCard />
            </div>
        </DoctorLayout>
    );
}

export default Dashboard;