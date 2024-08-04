import LoginRegLayout from '../../../Layouts/LoginLayout/LoginRegLayout';
import './Register.css';


const Register = () => {
    return (
        <LoginRegLayout>
            <div className="register">
                <div className="register-title">
                    <span> Đăng ký</span>
                </div>
                <form>
                    <div className="register-form-group">
                        <label htmlFor="FirstName">Họ và tên lót</label>
                        <input type="text" id="FirstName" name="FirstName" placeholder="Nhập họ và tên lót" />
                    </div>
                    <div className="register-form-group">
                        <label htmlFor="LastName">Tên</label>
                        <input type="text" id="LastName" name="LastName" placeholder="Nhập tên" />
                    </div>
                    <div className="register-form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="Nhập email" />
                    </div>
                    <div className="register-form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input type="password" id="password" name="password" placeholder="Nhập mật khẩu" />
                    </div>
                    <div className="register-form-group">
                        <label htmlFor="re-password">Nhập lại mật khẩu</label>
                        <input type="password" id="re-password" name="re-password" placeholder="Nhập lại mật khẩu" />
                    </div>
                    <div className="register-form-group-button">
                        <button type="submit">Đăng ký</button>
                    </div>
                </form>
                <div className="register-form-line">
                    <div className="line"></div>
                </div>
                <div className="register-form-login">
                    <span>Bạn đã có tài khoản? <a href="/login">Đăng nhập</a></span>
                </div>
            </div>
        </LoginRegLayout>

    )
}

export default Register;