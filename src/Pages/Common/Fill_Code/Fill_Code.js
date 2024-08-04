import './Fill_Code.css';
import LoginRegLayout from '../../../Layouts/LoginLayout/LoginRegLayout';

const Fill_Code = () => {
    return (
        <LoginRegLayout>
            <div className="fill-code">
                <div className="fill-code-title">
                    <span> Nhập mã xác nhận</span>
                </div>
                <div className="fill-code-des">
                    <span>Hãy nhập mã xác nhận đã được gửi vào email của bạn</span>
                </div>
                <form>
                    <div className="fill-code-form-group">
                        <label htmlFor="code">Mã xác nhận</label>
                        <input type="text" id="code" name="code" placeholder="Nhập mã xác nhận" />
                    </div>
                    <div className="fill-code-form-group-button">
                        <button type="submit">Xác nhận</button>
                    </div>
                </form>

                <div className="fill-code-back">
                <span>Quay lại <a href="/login">Đăng nhập</a>
                </span>
                </div>
            </div>
        </LoginRegLayout>

    )
}

export default Fill_Code;