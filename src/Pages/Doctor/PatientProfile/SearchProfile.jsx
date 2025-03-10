import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const SearchProfile = () => {
    return (
        <div className="patient-profile-card patient-search-profile">
            <div className="patient-profile-search-bar">
                <input
                    type="text"
                    placeholder="Tìm hồ sơ bệnh nhân..."
                    className="search-bar-input"
                />
                <button className="search-bar-button">
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </div>
        </div>
    )
}

export default SearchProfile