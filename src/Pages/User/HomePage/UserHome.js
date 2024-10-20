import './UserHome.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import DefaultLayout from '../../../Layouts/DefaultLayout/DefaultLayout';
import LeftUserHome from './LeftUserHome/LeftUserHome';
import CenterUserHome from './CenterUserHome/CenterUserHome';
import RightUserHome from './RightUserHome/RightUserHome';
import DetailDay from './RightUserHome/DetailDay';
const UserHome = () => {
    const [isDetailDayOpen, setIsDetailDayOpen] = useState(false);
    const [apptList, setApptList] = useState([]);

    const handleOpenDetailDay = (apptList) => {
        setIsDetailDayOpen(true);
        setApptList(apptList);
    };

    const handleCloseDetailDay = () => {
        setIsDetailDayOpen(false);
    };

    return (
        <DefaultLayout>
            <div className="container"></div>
            <div className="user-home">
                <LeftUserHome />
                <CenterUserHome isDetailDayOpen={isDetailDayOpen} />
                <RightUserHome onOpenDetailDay={handleOpenDetailDay} />
                {isDetailDayOpen && (
                    <div className="detail-day-overlay" onClick={handleCloseDetailDay}>
                        <DetailDay apptList={apptList} />
                    </div>
                )}
            </div>
        </DefaultLayout>


    );
}

export default UserHome;