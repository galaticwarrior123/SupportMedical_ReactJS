import React from 'react';
import './SearchBar.css';
import { useDispatch, useSelector } from 'react-redux';
import { performSearch, setSearchQuery } from '../../../../redux/slices/searchSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchBar = () => {
    const dispatch = useDispatch();
    const {searchQuery} = useSelector((state) => state.search);

    const handleSearch = () => {
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
