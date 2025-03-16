import { useSelector } from "react-redux";
import DoctorLayout from "../../../Layouts/Doctor/DoctorLayout";
import AppointmentList from "./AppointmentList";
import './Dashboard.css';
import DashboardHeader from "./DasheboardHeader";
import PatientCard from "./PatientCard";
import RecordResultModal from "./RecordResultModal";

const Dashboard = () => {
    const { isRecordResultModalOpen } = useSelector((state) => state.doctorDashboard);
    return (
        <DoctorLayout>
            <DashboardHeader />
            {isRecordResultModalOpen && <RecordResultModal />}
            <div className="dashboard-doctor-container">
                <AppointmentList />
                <PatientCard />
            </div>
        </DoctorLayout>
    );
}

export default Dashboard;