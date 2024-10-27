import React from 'react';
import './SearchBar.css';
import { useDispatch, useSelector } from 'react-redux';
import { performSearch, setSearchQuery } from '../../../../redux/slices/searchSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {searchQuery, activeTab, postFilter, userFilter} = useSelector((state) => state.search);

    const handleSearch = () => {

        const params = new URLSearchParams();
        params.set("tab", activeTab);
        if (searchQuery) params.set("query", searchQuery);
        if (postFilter.tagId) params.set("tagId", postFilter.tagId);
        if (userFilter.isDoctor) params.set("isDoctor", userFilter.isDoctor);

        // Cập nhật URL với query parameters
        navigate(`?${params.toString()}`, { replace: true });
        dispatch(performSearch());
    }

    return (
        <div className="search-bar-container">
            <input
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                type="text"
                placeholder="Tìm người khác, bài viết, ..."
                className="search-bar-input"
            />
            <button onClick={handleSearch} className="search-bar-button">
                <FontAwesomeIcon icon={faSearch} />
            </button>
        </div>
    );
};

export default SearchBar;
