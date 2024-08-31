import { formatMessageTime } from '../../../../Common/DatetimeUtils';
import './ChatItem.css';

const SearchItem = ({ item, onClick }) => {

    return (
            <div onClick={onClick} className="chat-item">
                <div className="chat-item-avatar">
                    <img src={item?.avatar} alt="avatar" />
                </div>
                <div className="chat-item-content">
                    <div className="chat-item-content-title">
                        <span>{item.firstName} {item.lastName}</span>
                    </div>
                </div>
            </div>
    )
}

export default SearchItem;