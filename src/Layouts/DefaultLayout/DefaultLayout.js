import './DefaultLayout.css';
import Header from '../Header/Header';
import NotificationRequest from '../../Components/NotificationRequest';
import SocketEventListener from '../../Components/SocketEventListener';
import { ToastContainer } from 'react-toastify';

const DefaultLayout = ({ children }) => {
    
    return (
        <div className="default-layout">
            <ToastContainer style={{ position: 'fixed', top: 60, right: 20 }} />
            <NotificationRequest />
            <SocketEventListener />
            <Header />
            <div className="content">
                {children}
            </div>
        </div>
    )
}

export default DefaultLayout;