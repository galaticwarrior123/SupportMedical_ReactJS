import ItemPostUserHome from '../../../../Components/ItemPostUserHome/ItemPostUserHome';
import './CenterUserHome.css';


const CenterUserHome = () => {
    return (
        <div className="center-user-home">
            <div className="center-user-home-container"></div>

            <div className="center-user-home-activity">
                <img src="https://via.placeholder.com/50" alt="avatar" />
                <input type="text" placeholder="Bạn đang nghĩ gì?" />
            </div>

            <div className='center-user-home-listPost'>
                
                <ItemPostUserHome />

                <ItemPostUserHome />

            </div>
        </div>
    )
}

export default CenterUserHome;