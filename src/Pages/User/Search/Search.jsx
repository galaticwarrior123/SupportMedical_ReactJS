import React, { useEffect } from 'react';
import SearchBar from './SearchBar/SearchBar';
import TabBar from './TabBar/TabBar';
import EmptyState from './EmptyState/EmptyState';
import DefaultLayout from '../../../Layouts/DefaultLayout/DefaultLayout';
import './Search.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UserSearchItem from './UserSearchItem/UserSearchItem';
import ItemPostUserHome from '../../../Components/ItemPostUserHome/ItemPostUserHome';
import { useAuth } from '../../../context/AuthProvider';
import { searchPosts, searchUsers, setActiveTab, setPostFilter, setSearchQuery } from '../../../redux/slices/searchSlice';
import SearchFilter from './SearchFilter/SearchFilter';

const Search = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { postResults, userResults, 
            searchQuery, postFilter, 
            userFilter, activeTab, } = useSelector((state) => state.search);
    const { user} = useAuth();

    useEffect(() => {
        const params = new URLSearchParams();
        params.set("tab", activeTab);
        if (searchQuery) params.set("query", searchQuery);
        if (postFilter.tagId) params.set("tagId", postFilter.tagId);
        if (userFilter.isDoctor) params.set("isDoctor", userFilter.isDoctor);

        // Cập nhật URL với query parameters
        navigate(`?${params.toString()}`, { replace: true });
    }, [searchQuery, activeTab, postFilter, userFilter, navigate]);

    // useEffect(() => {
    //     const params = new URLSearchParams(window.location.search);
    //     const tab = params.get("tab") || "posts"; // Giá trị mặc định cho tab
    //     const query = params.get("query") || "";
    //     const tagId = params.get("tagId") || null;
    //     const isDoctor = params.get("isDoctor") === "true";
    
    //     // Cập nhật state dựa trên URL để kích hoạt tìm kiếm
    //     dispatch(setActiveTab(tab));
    //     dispatch(setSearchQuery(query));
    //     dispatch(setPostFilter({ tagId }));
    //     dispatch(setPostFilter({ isDoctor }));
    
    //     if (tab === "posts" && query) {
    //       dispatch(searchPosts(searchQuery, postFilter));
    //     } else if (tab === "people" && query) {
    //       dispatch(searchUsers(searchQuery, userFilter));
    //     }
    // }, []); // Chỉ chạy một lần khi component mount

    return (
        <DefaultLayout>
            <div className='search-page'>
                <SearchBar />
                <TabBar activeTab={activeTab} />
                <SearchFilter />
                {
                    (activeTab === 'posts' && postResults.length === 0) || (activeTab === 'people' && userResults.length === 0) ? (
                        <EmptyState />
                    ) : null
                }
                {
                    activeTab === 'posts' ? (
                        <div className='search-results'>
                            {postResults.map((post) => (
                                <ItemPostUserHome currentUser={user} key={post._id} itemPost={post} />
                            ))}
                        </div>
                    ) : (
                        <div className='search-results'>
                            {userResults.map((user) => (
                                <UserSearchItem key={user._id} user={user} />
                            ))}
                        </div>
                    )
                }
            </div>
        </DefaultLayout>
    );
};

export default Search;
