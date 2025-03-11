import React, { useState } from 'react';
import DefaultLayoutRegisterMedicalExaminationPage from '../../../../../Layouts/DefaultLayoutRegisterMedicalExaminationPage/DefaultLayoutRegisterMedicalExaminationPage';
import './SelectPaymentPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt, faPhone, faUser, faUserMd, faCalendarAlt, faClock, faIdCard, faClinicMedical, faStethoscope, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const SelectPaymentPage = () => {
    const [selectedPayment, setSelectedPayment] = useState(null);

    const handlePaymentSelection = (event) => {
        setSelectedPayment(event.target.value);
    };

    return (
        <DefaultLayoutRegisterMedicalExaminationPage>
            <div className="select-payment-container">
                <div className="left-section">
                    <div className="left-section-container">
                        <div className="section-title">Thông tin bệnh nhân</div>
                        <div className="left-section-patient-info">
                            <p><FontAwesomeIcon icon={faUser} /> NGUYỄN TRỌNG PHÚC</p>
                            <p><FontAwesomeIcon icon={faPhone} /> 0823452559</p>
                            <p><FontAwesomeIcon icon={faMapMarkedAlt} /> Phường Linh Trung Thành phố Thủ Đức Thành phố Hồ Chí Minh</p>
                        </div>
                    </div>

                </div>

                <div className="right-section">
                    <div className="section-title">Chọn phương thức thanh toán</div>
                    <div className="right-section-content">
                        <div className="payment-methods">
                            {['VietQR', 'Ví Momo', 'Thẻ quốc tế Visa, Master, JCB', 'Thẻ ATM nội địa/ Internet Banking', 'Thẻ khám bệnh'].map((method, index) => (
                                <label key={index}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={method}
                                        checked={selectedPayment === method}
                                        onChange={handlePaymentSelection}
                                    />
                                    {method}
                                </label>
                            ))}
                        </div>

                        <div className="payment-info-container">
                            <div className="payment-info-section-title">
                                <FontAwesomeIcon icon={faIdCard} /> <span>Thông tin thanh toán</span></div>
                            <div className="payment-info">
                                <div>
                                    <div className="info-left">
                                        <FontAwesomeIcon icon={faStethoscope} /> <span>Chuyên khoa:</span>
                                    </div>
                                    <div className="info-right">TAI MŨI HỌNG</div>
                                </div>
                                <div>
                                    <div className="info-left">
                                        <FontAwesomeIcon icon={faUserMd} /> <span>Bác sĩ:</span>
                                    </div>
                                    <div className="info-right">Âu Thị Cẩm Lệ</div>
                                </div>
                                <div>
                                    <div className="info-left">
                                        <FontAwesomeIcon icon={faClinicMedical} /> <span>Dịch vụ:</span>
                                    </div>
                                    <div className="info-right">Khám dịch vụ</div>
                                </div>
                                <div>
                                    <div className="info-left">
                                        <FontAwesomeIcon icon={faCalendarAlt} /> <span>Ngày khám:</span>
                                    </div>
                                    <div className="info-right">14/03/2025</div>
                                </div>
                                <div>
                                    <div className="info-left">
                                        <FontAwesomeIcon icon={faClock} /> <span>Giờ khám:</span>
                                    </div>
                                    <div className="info-right">08:00 - 09:00</div>
                                </div>
                                <div>
                                    <div className="info-left">
                                        <span>Tiền khám:</span>
                                    </div>
                                    <div className="info-right" style={{ color: '#00C2FF', fontWeight: 'bold' }}>150.000 đ</div>
                                </div>
                            </div>
                            <div className="total-amount">Tổng cộng: <span style={{ color: '#00C2FF', fontWeight: 'bold' }}>150.000 đ</span></div>
                            <div className="total-amount-action">
                                <button disabled={!selectedPayment}>Thanh toán</button>
                            </div>

                        </div>
                    </div>

                    <button className="back-button" onClick={() => window.history.back()}>
                        <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
                    </button>
                </div>


            </div>
        </DefaultLayoutRegisterMedicalExaminationPage>
    );
};

export default SelectPaymentPage;
