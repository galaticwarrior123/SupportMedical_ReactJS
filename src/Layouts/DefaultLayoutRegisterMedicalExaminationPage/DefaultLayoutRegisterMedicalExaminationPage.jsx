import { ToastContainer } from "react-toastify"
import NotificationRequest from "../../Components/NotificationRequest"
import SocketEventListener from "../../Components/SocketEventListener"
import HeaderRegisterMedicalExaminationPage from "../Header/HeaderRegisterMedicalMedicalExaminationPage"
import Footer from "../Footer/Footer"
import './DefaultLayoutRegisterMedicalExaminationPage.css'


const DefaultLayoutRegisterMedicalExaminationPage = ({ children }) => {

    return (
        <div className="default-layout">
            <ToastContainer style={{ position: 'fixed', top: 60, right: 20 }} />
            <NotificationRequest />
            <SocketEventListener />
            <HeaderRegisterMedicalExaminationPage />
            <div className="content-register-medical-examination-page">
                {children}
            </div>

            <Footer />
        </div>
    )
}
export default DefaultLayoutRegisterMedicalExaminationPage