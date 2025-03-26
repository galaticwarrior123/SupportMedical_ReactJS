import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useRef, useState } from "react"
import { RecordPatientAPI } from "../../../API/RecordPatientAPI"
import { useDispatch } from "react-redux"
import { setPatientProfile } from "../../../redux/slices/doctorPatientProfileSlice"

const SearchProfile = () => {
    const dispatch = useDispatch();
    const [searchProfiles, setSearchProfiles] = useState([]);
    const [searchKey, setSearchKey] = useState('');
    const [isListVisible, setIsListVisible] = useState(false);
    const searchListRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (searchListRef.current && !searchListRef.current.contains(e.target)) {
                setIsListVisible(false);
            }
        }
        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        }
    }, []);

    const searchProfile = async () => {
        const response = await RecordPatientAPI.searchRecordPatient(searchKey);
        console.log(response);
        setSearchProfiles(response.data);
        setIsListVisible(true);
    }

    const selectProfile = (profile) => {
        dispatch(setPatientProfile(profile));
        setSearchKey('');
        setIsListVisible(false);
        setSearchProfiles([]);
    }

    return (
        <div className="patient-profile-card patient-search-profile">
            <div className="patient-profile-search-bar">
                <input
                    value={searchKey}
                    type="text"
                    placeholder="Tìm hồ sơ bệnh nhân theo tên, SĐT..."
                    className="search-bar-input"
                    onChange={(e) => {
                        setSearchKey(e.target.value);
                        setIsListVisible(false);
                        setSearchProfiles([]);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            searchProfile();
                        }
                    }}
                />
                <button className="search-bar-button" onClick={searchProfile}>
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </div>
            {isListVisible
            && <div className="search-profile-list" ref={searchListRef}>
                {searchProfiles.length === 0 && <p>Không tìm thấy hồ sơ nào</p>}
                {searchProfiles.map((profile, index) => (
                    <div className="search-profile-item" key={index}
                        onClick={() => selectProfile(profile)}
                    >
                        <p>{profile.name}</p>
                        <p>{profile.phoneNumber} - {profile.dob}</p>
                    </div>
                ))}
            </div>}
        </div>
    )
}

export default SearchProfile