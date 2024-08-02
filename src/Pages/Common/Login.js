import LoginRegLayout from '../../Layouts/LoginLayout/LoginRegLayout';
import './Login.css';

const Login = () => {
    return (
        <LoginRegLayout>
            <div className="login">
                <h1>Login</h1>
                <form>
                    <input type="text" placeholder="Username" />
                    <input type="password" placeholder="Password" />
                    <button>Login</button>
                </form>
            </div>
        </LoginRegLayout>
    )
}

export default Login;