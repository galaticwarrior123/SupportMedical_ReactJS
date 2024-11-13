import React, { useEffect } from 'react';
import SearchBar from './SearchBar/SearchBar';
import TabBar from './TabBar/TabBar';
import EmptyState from './EmptyState/EmptyState';
import DefaultLayout from '../../../Layouts/DefaultLayout/DefaultLayout';
import './Search.css';
import { useDispatch, useSelector } from 'react-redux';
import UserSearchItem from './UserSearchItem/UserSearchItem';
import ItemPostUserHome from '../../../Components/ItemPostUserHome/ItemPostUserHome';
import { useAuth } from '../../../context/AuthProvider';
import { performSearch, setActiveTab, setPostFilter, setSearchQuery, setUserFilter, setUserResults } from '../../../redux/slices/searchSlice';
import SearchFilter from './SearchFilter/SearchFilter';
import { UserAPI } from '../../../API/UserAPI';

const Search = () => {
    const dispatch = useDispatch();
    const { postResults, userResults, activeTab } = useSelector((state) => state.search);
    const { user} = useAuth();
    const params = new URLSearchParams(window.location.search);
    
    useEffect(() => {
        // get search params from URL
        const query = params.get('query');
        const tab = params.get('tab');
        const tagId = params.get('tagId');
        const isDoctor = params.get('isDoctor');

        // set search params to redux store
        dispatch(setSearchQuery(query || ''));
        if (tab) dispatch(setActiveTab(tab));
        if (tagId) dispatch(setPostFilter({ tagId }));
        if (isDoctor) dispatch(setUserFilter({ isDoctor: isDoctor === 'true' }));

        if (query || tagId || isDoctor) {
            dispatch(performSearch());
        }
    }, [dispatch]);

    const followUser = (userId) => {
        UserAPI.followUser(userId)
            .then(() => {
                const updatedUserResults = userResults.map((user) => {
                    if (user._id === userId) {
                        return { ...user, isFollowing: !user.isFollowing };
                    }
                    return user;
                });
                dispatch(setUserResults(updatedUserResults));
            })
            .catch((error) => {
                console.error(error);
            });
    }

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
                                <UserSearchItem followUser={followUser} key={user._id} user={user} />
                            ))}
                        </div>
                    )
                }
            </div>
        </DefaultLayout>
    );
};

export default Search;
