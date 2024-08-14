import './UserHome.css';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '../../../Layouts/DefaultLayout/DefaultLayout';
import LeftUserHome from './LeftUserHome/LeftUserHome';
import CenterUserHome from './CenterUserHome/CenterUserHome';
import RightUserHome from './RightUserHome/RightUserHome';
const UserHome = () => {
    const navigate = useNavigate();
    
    return (
        <DefaultLayout>
            <div className="user-home">
                <LeftUserHome />
                <CenterUserHome />
                <RightUserHome />
            </div>
        </DefaultLayout>


    );
}

export default UserHome;