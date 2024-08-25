import Calendar from './Calendar';
import './RightUserHome.css';
const RightUserHome = ({ onOpenDetailDay }) => {

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
                    <div className="right-user-home-follow-item">
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
                    </div>

                </div>
            </div>
        </div>
    )
}

export default RightUserHome;