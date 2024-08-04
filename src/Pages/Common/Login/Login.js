import LoginRegLayout from '../../../Layouts/LoginLayout/LoginRegLayout';
import './Login.css';

const Login = () => {
    return (
        <LoginRegLayout>
            <div className="login">
                <div className="login-title">
                    <span> Đăng nhập</span>
                </div>
                <form>
                    <div className="login-form-group">
                        <label htmlFor="email">Username hoặc Email</label>
                        <input type="email" id="email" name="email" placeholder="Nhập email" />
                    </div>
                    <div className="login-form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input type="password" id="password" name="password" placeholder="Nhập mật khẩu" />
                    </div>
                    <div className="login-form-group-checkbox">
                        <input type="checkbox" id="remember" name="remember" />
                        <label htmlFor="remember">Ghi nhớ đăng nhập</label>
                    </div>
                    <div className="login-form-group-button">
                        <button type="submit">Đăng nhập</button>
                    </div>
                </form>
                <div className="login-forgot-password">
                    <a href="/forgot-password/fill-email">Quên mật khẩu?</a>
                </div>
                <div className="login-form-line">
                    <div className="line"></div>
                </div>
                <div className="login-form-register">
                    <span>Bạn chưa có tài khoản? <a href="/register">Đăng ký</a></span>
                </div>
            </div>
        </LoginRegLayout>
    )
}

export default Login;