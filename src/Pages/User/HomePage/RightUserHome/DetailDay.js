import './DetailDay.css';

const DetailDay = () => {
    return (
        <div className="detail-day">
            <div className='detail-day-body'>
                <div className="detail-day__header">
                    <div className="detail-day__header__title">
                        <span>Thứ 2, 20/09/2021</span></div>
                </div>
                <div className="detail-day__content">
                    <div className="detail-day__content__title">Sự kiện</div>
                    <div className="detail-day__content__event"></div>
                    <div className="detail-day__content__title">Nhiệm vụ</div>
                    <div className="detail-day__content__task"></div>
                </div>
            </div>
        </div>
    );
}

export default DetailDay;