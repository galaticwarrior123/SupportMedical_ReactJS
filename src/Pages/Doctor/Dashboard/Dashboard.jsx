import DoctorLayout from "../../../Layouts/Doctor/DoctorLayout";

const Dashboard = () => {
    console.log('Doctor Dashboard');
    return (
        <DoctorLayout>
            <h1>Doctor Dashboard</h1>
            <p>
                This is the dashboard for doctor.
            </p>
        </DoctorLayout>
    );
}

export default Dashboard;