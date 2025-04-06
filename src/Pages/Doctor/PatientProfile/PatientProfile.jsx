import DoctorLayout from "../../../Layouts/Doctor/DoctorLayout";
import MedicalHistory from "./MedicalHistory";
import PatientInfo from "./PatientInfo";
import SearchProfile from "./SearchProfile";
import './PatientProfile.css';
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { RecordPatientAPI } from "../../../API/RecordPatientAPI";
import { setPatientProfile } from "../../../redux/slices/doctorPatientProfileSlice";
import { useDispatch } from "react-redux";

const PatientProfile = () => {
    const dispatch = useDispatch();
    const { profileId } = useParams();
    useEffect(() => {
        const fetchPatientProfile = async () => {
            if (!profileId) {
                return;
            }
            const response = await RecordPatientAPI.getRecordPatientById(profileId);
            console.log(response);
            dispatch(setPatientProfile(response.data));
        }
        fetchPatientProfile();
    }, []);
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