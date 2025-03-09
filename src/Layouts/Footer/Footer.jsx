import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            {/* Cột trái: Logo và thông tin liên hệ */}
            <div className="footer-left">
                <div className="footer-left-container">
                    <div className="footer-left-container-logo">
                        <div className="footer-left-container-logo-text" >
                            <img src="/images/Logo.png" alt="logo" />
                        </div>

                    </div>
                    <div className="footer-left-container-line">
                    </div>
                    <div className="footer-left-container-slogan">
                        <span>Đặt lịch khám chữa bệnh nhanh</span>
                    </div>

                    <p>Địa chỉ: Số 1, Võ Văn Ngân - Thủ Đức - TP.HCM</p>
                    <p>Email: <a href="mailto:ClicknicUTE@gmail.com">ClicknicUTE@gmail.com</a></p>
                    <p>Điện thoại: <a href="tel:0834635679">0834635679</a></p>
                </div>
            </div>

            {/* Cột phải: Liên kết */}
            <div className="footer-right">
                <div className="footer-right-container">
                    <h3>Về Clicknic</h3>
                    <a href="#">Giới thiệu</a>
                    <a href="#">Điều khoản dịch vụ</a>
                    <a href="#">Chính sách bảo mật</a>
                </div>

            </div>
        </footer>
    );
}

export default Footer;
