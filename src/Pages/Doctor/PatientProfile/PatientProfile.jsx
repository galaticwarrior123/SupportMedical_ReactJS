import DoctorLayout from "../../../Layouts/Doctor/DoctorLayout";
import MedicalHistory from "./MedicalHistory";
import PatientInfo from "./PatientInfo";
import SearchProfile from "./SearchProfile";
import './PatientProfile.css';

const PatientProfile = () => {
    return (
        <DoctorLayout>
            <div className="patient-profile-container">
                <div className="patient-profile-left">
                    <SearchProfile />
                    <PatientInfo />
                </div>
                <div className="patient-profile-right">
                    <MedicalHistory />
                </div>
            </div>
        </DoctorLayout>
    );
}

export default PatientProfile;