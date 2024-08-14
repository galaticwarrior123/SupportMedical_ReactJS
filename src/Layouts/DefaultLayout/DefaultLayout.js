import './DefaultLayout.css';
import Header from '../Header/Header';
const DefaultLayout = ({ children }) => {
    return (
        <div className="default-layout">
            <Header />
            <div className="content">
                {children}
            </div>
        </div>
    )
}

export default DefaultLayout;