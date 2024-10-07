import Calendar from './Calendar';
import './RightUserHome.css';
import { UserAPI } from '../../../../API/UserAPI';
import { useEffect, useState } from 'react';

const RightUserHome = ({ onOpenDetailDay }) => {
    const [allFollowUser, setAllFollowUser] = useState([]);
    useEffect(() => {
        fetchAllFollowUser();
    }, []);

    const fetchAllFollowUser = async () => {
        try {
            const response = await UserAPI.getAll();
            if (response.status === 200) {
                // liệt kê tất cả các user mà bản thân đang theo dõi
                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i].following.length > 0) {
                        for (let j = 0; j < response.data[i].following.length; j++) {
                            if(response.data[i]._id === JSON.parse(localStorage.getItem('user'))._id){
                                setAllFollowUser(response.data[i]);
                            }
                        }
                    }
                } 
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="right-user-home">
            <div className="right-user-home-calendar">
                <Calendar onOpenDetailDay={onOpenDetailDay}/>
            </div>
            <div className="right-user-home-follow">
                <div className="right-user-home-follow-header">
                    <span>Đang theo dõi</span>
                </div>
                <div className="right-user-home-follow-body">
                    {allFollowUser.following && allFollowUser.following.length > 0 ? allFollowUser.following.map((user) => (
                        <div key={user._id} className="right-user-home-follow-item">
                            <img src={user.avatar} alt="" />
                            <span>{user.firstName} {user.lastName}</span>
                        </div>
                    )) : <div className="right-user-home-follow-item">
                        <span>Chưa theo dõi ai cả</span>
                    </div>}
                    
                    {/* <div className="right-user-home-follow-item">
                        <img src="https://picsum.photos/200/200" alt="" />
                        <span>Nguyễn Văn A</span>
                    </div>
                    <div className="right-user-home-follow-item">
                        <img src="https://picsum.photos/200/200" alt="" />
                        <span>Nguyễn Văn B</span>
                    </div>
                    <div className="right-user-home-follow-item">
                        <img src="https://picsum.photos/200/200" alt="" />
                        <span>Nguyễn Văn C</span>
                    </div>
                    <div className="right-user-home-follow-item">
                        <img src="https://picsum.photos/200/200" alt="" />
                        <span>Nguyễn Văn C</span>
                    </div>
                    <div className="right-user-home-follow-item">
                        <img src="https://picsum.photos/200/200" alt="" />
                        <span>Nguyễn Văn C</span>
                    </div>
                    <div className="right-user-home-follow-item">
                        <img src="https://picsum.photos/200/200" alt="" />
                        <span>Nguyễn Văn C</span>
                    </div>
                    <div className="right-user-home-follow-item">
                        <img src="https://picsum.photos/200/200" alt="" />
                        <span>Nguyễn Văn C</span>
                    </div> */}

                </div>
            </div>
        </div>
    )
}

export default RightUserHome;