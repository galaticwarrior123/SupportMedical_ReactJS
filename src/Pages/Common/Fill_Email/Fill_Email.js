import LoginRegLayout from '../../../Layouts/LoginLayout/LoginRegLayout';
import './Fill_Email.css';


const Fill_Email = () => {
    return (
        <LoginRegLayout>
            <div className="fill-email">
                <div className="fill-email-title">
                    <span> Nhập email của bạn</span>
                </div>
                <div className="fill-email-des">
                    <span>Hãy nhập email của bạn để nhận mã xác nhận</span>
                </div>
                <form>
                    <div className="fill-email-form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="Nhập email" />
                    </div>
                    <div className="fill-email-form-group-button">
                        <button type="submit">Gửi mã</button>
                    </div>
                </form>

                <div className="fill-email-back">
                    <span>Quay lại <a href="/login">Đăng nhập</a>
                    </span>

                </div>
            </div>
        </LoginRegLayout>

    )
}

export default Fill_Email;