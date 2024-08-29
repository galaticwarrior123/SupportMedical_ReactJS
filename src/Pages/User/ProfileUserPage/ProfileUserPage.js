import DefaultLayout from '../../../Layouts/DefaultLayout/DefaultLayout';
import AboutProfile from './AboutProfile/AboutProfile';
import FollowersProfile from './FollowersProfile/FollowersProfile';
import HeaderProfile from './HeaderProfile/HeaderProfile';
import PostsProfile from './PostsProfile/PostsProfile';
import './ProfileUserPage.css';


const ProfileUserPage = () => {
    return (
        <DefaultLayout>
            <div className="profile-page-profile">
                <HeaderProfile />
                <div className="profile-content-profile">
                    <div className="left-side-profile">
                        <AboutProfile />
                        <FollowersProfile />
                    </div>
                    <div className="right-side-profile">
                        <PostsProfile />
                        <PostsProfile />
                        <PostsProfile />
                    </div>
                </div>
            </div>
        </DefaultLayout>

    );
}

export default ProfileUserPage;