import './Fill_NewPassword.css';
import LoginRegLayout from '../../../Layouts/LoginLayout/LoginRegLayout';

const Fill_NewPassword = () => {
    return (
        <LoginRegLayout>
            <div className="fill-new-password">
                <div className="fill-new-password-title">
                    <span> Đặt lại mật khẩu</span>
                </div>
                <div className="fill-new-password-des">
                    <span>Hãy nhập mật khẩu mới của bạn</span>
                </div>
                <form>
                    <div className="fill-new-password-form-group">
                        <label htmlFor="password">Mật khẩu mới</label>
                        <input type="password" id="password" name="password" placeholder="Nhập mật khẩu mới" />
                    </div>
                    <div className="fill-new-password-form-group">
                        <label htmlFor="re-password">Nhập lại mật khẩu mới</label>
                        <input type="password" id="re-password" name="re-password" placeholder="Nhập lại mật khẩu mới" />
                    </div>
                    <div className="fill-new-password-form-group-button">
                        <button type="submit">Xác nhận</button>
                    </div>
                </form>

                {/* <div className="fill-new-password-back">
                    <span>Quay lại</span>
                    <a href="/login">Đăng nhập</a>
                </div> */}
            </div>
        </LoginRegLayout>

    )
}

export default Fill_NewPassword;