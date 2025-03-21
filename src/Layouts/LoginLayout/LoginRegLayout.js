import { ToastContainer } from 'react-toastify';
import './LoginRegLayout.css';
import { useEffect, useState } from 'react';

const LoginRegLayout = ({ children }) => {
    const images = [
        '/images/pictureDoctor.jpg',
        '/images/pictureDoctor2.jpg',
        '/images/doctor_picture.jpg',
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [nextImageIndex, setNextImageIndex] = useState((currentImageIndex + 1) % images.length);
    const [fadeIn, setFadeIn] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFadeIn(false);
            setTimeout(() => {
                setCurrentImageIndex((prev) => {
                    const newIndex = (prev + 1) % images.length;
                    setNextImageIndex((newIndex + 1) % images.length);
                    return newIndex;
                });
                setFadeIn(true);
            }, 300); // Change image after fade-out
        }, 10000); // Change image every 10 seconds

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="login-reg-layout">
            <ToastContainer style={{ position: 'fixed', top: 60, right: 20 }} />
            <div
                className={`login-reg-layout-background ${fadeIn ? 'fade-in' : ''}`}
                style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
            />
            <div
                className="login-reg-layout-background"
                style={{ backgroundImage: `url(${images[nextImageIndex]})`, opacity: 0 }}
            />
            <div className="login-reg-layout-overlay" />
            <div className="login-reg-layout-block">
                {children}
            </div>
        </div>
    );
}

export default LoginRegLayout;
