import { useNavigate } from 'react-router-dom';
import ApptItem from '../../Appointment/ApptItem/ApptItem';
import './DetailDay.css';

const DetailDay = ({ apptList }) => {
    const navigate = useNavigate();
    const dateToDateWithDatOfWeek = (date) => {
        const dayOfWeek = ['Chủ nhật, ', 'Thứ 2, ', 'Thứ 3, ', 'Thứ 4, ', 'Thứ 5, ', 'Thứ 6, ', 'Thứ 7, '];
        const day = new Date(date).getDay();
        return dayOfWeek[day] + new Date(date).toLocaleDateString();
    }
    return (
        <div className="detail-day">
            <div className='detail-day-body'>
                <div className="detail-day__header">
                    <div className="detail-day__header__title">
                        <span>{dateToDateWithDatOfWeek(new Date(apptList[0].date))}</span>
                    </div>
                </div>
                <div className="detail-day__content">
                    {/* <div className="detail-day__content__title">Sự kiện</div>
                    <div className="detail-day__content__event"></div>
                    <div className="detail-day__content__title">Nhiệm vụ</div>
                    <div className="detail-day__content__task"></div> */}
                    {
                        apptList.map((appt, index) => (
                            <ApptItem key={index} appt={appt} onClick={() => navigate(`appointment/${appt._id}`)} />
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default DetailDay;