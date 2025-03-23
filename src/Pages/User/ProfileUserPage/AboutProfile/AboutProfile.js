import './AboutProfile.css';

const AboutProfile = ({ user }) => {
    return (
        <div className="about-container-profile">
          <h3>Giới thiệu</h3>
          <pre> <br/>
          {/* Chứng chỉ hành nghề - <a href="#">click để xem ảnh</a> */}
            {user.bio ? user.bio : 'Chưa có tiểu sử'}
          </pre>
        </div>
      );
}


export default AboutProfile;