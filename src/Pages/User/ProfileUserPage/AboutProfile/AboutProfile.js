import './AboutProfile.css';

const AboutProfile = ({ user }) => {
    return (
        <div className="about-container-profile">
          <h3>Giới thiệu</h3>
          <p>Lorem ipsum <br/>Chứng chỉ hành nghề - <a href="#">click để xem ảnh</a></p>
        </div>
      );
}


export default AboutProfile;