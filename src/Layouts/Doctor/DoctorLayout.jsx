import ShowProfileOption from "./ShowProfileOption";
import { ToastContainer } from 'react-toastify';
import SidebarDoctor from "./SidebarDoctor";
import { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SidebarContext, SidebarProvider } from "./SidebarContext";
import './DoctorLayout.css';

const DoctorLayout = ({ children }) => {
    console.log(children);
    const location = useLocation();
    const { isCollapsed } = useContext(SidebarContext);
    const [activeMenu, setActiveMenu] = useState('Tổng quan');
    const [showProfile, setShowProfile] = useState(false);

    const handleShowProfile = () => {
        setShowProfile(!showProfile);
    }
    // Map paths to menu names
    const menuNames = {
        '/doctor': 'Tổng quan',
        '/doctor/patient-profile': 'Hồ sơ bệnh nhân',
        '/doctor/schedule': 'Lịch làm việc',
        // Add more paths and their corresponding names as needed
    };

    useEffect(() => {
        const currentPath = location.pathname;
        setActiveMenu(menuNames[currentPath] || 'Tổng quan');
    }, [location.pathname]);

    return (
        <div className={`doctorContainer ${isCollapsed ? 'collapsed' : ''}`}>
            <ToastContainer />
            <SidebarDoctor
                onMenuClick={setActiveMenu}
                activeMenu={activeMenu}
            />
            <main className="mainContentDoctor">
                <header className="headerDoctor">
                    <div className="labelDoctor">
                        <span>{activeMenu}</span>
                    </div>
                    <div className="profileDoctor">
                        {/* <button className="notification">
                                <FontAwesomeIcon icon={faBell} />
                            </button> */}
                        <img src={JSON.parse(localStorage.getItem('user')).avatar} alt="User" className="avatarDoctor" onClick={handleShowProfile} />
                        {showProfile && (
                            <ShowProfileOption handleCloseShowProfile={handleShowProfile} />
                        )}
                    </div>
                </header>
                <section className="contentDoctor">
                    {children}
                </section>
            </main>
        </div>
    );
}

export default ({ children }) => (
    <SidebarProvider>
        <DoctorLayout>{children}</DoctorLayout>
    </SidebarProvider>
)