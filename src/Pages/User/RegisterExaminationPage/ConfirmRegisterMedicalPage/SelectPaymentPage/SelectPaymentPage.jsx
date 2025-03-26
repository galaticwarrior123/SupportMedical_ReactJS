import React, { useState } from 'react';
import DefaultLayoutRegisterMedicalExaminationPage from '../../../../../Layouts/DefaultLayoutRegisterMedicalExaminationPage/DefaultLayoutRegisterMedicalExaminationPage';
import './SelectPaymentPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt, faPhone, faUser, faUserMd, faCalendarAlt, faClock, faIdCard, faClinicMedical, faStethoscope, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';


const SelectPaymentPage = () => {
    const [selectedPayment, setSelectedPayment] = useState(null);
    const location = useLocation();
    const doctorSelected = location.state;
    const navigate = useNavigate();
    const handlePaymentSelection = (event) => {
        setSelectedPayment(event.target.value);
    };

    const handlePayment = () => {

        if(selectedPayment === 'Thẻ ATM nội địa/ Internet Banking'){
            navigate('/select-bank', {state: doctorSelected});
        }
    };

    return (
        <DefaultLayoutRegisterMedicalExaminationPage>
            <div className="select-payment-container">
                <div className="left-section">
                    <div className="left-section-container">
                        <div className="section-title">Thông tin bệnh nhân</div>
                        <div className="left-section-patient-info">
                            <p><FontAwesomeIcon icon={faUser} /> {doctorSelected.record.name}</p>
                            <p><FontAwesomeIcon icon={faPhone} /> {doctorSelected.record.phoneNumber}</p>
                            <p><FontAwesomeIcon icon={faMapMarkedAlt} /> {doctorSelected.record.address}, {doctorSelected.record.ward}, {doctorSelected.record.district}, {doctorSelected.record.province}</p>
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
                                    <div className="info-right">{doctorSelected.doctor.doctorInfo.specialities[0].name}</div>
                                </div>
                                <div>
                                    <div className="info-left">
                                        <FontAwesomeIcon icon={faUserMd} /> <span>Bác sĩ:</span>
                                    </div>
                                    <div className="info-right"> BS. {doctorSelected.doctor.firstName} {doctorSelected.doctor.lastName} </div>
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
                                    
                                    <div className="info-right">{doctorSelected.date.split('-').reverse().join('-')} </div>
                                </div>
                                <div>
                                    <div className="info-left">
                                        <FontAwesomeIcon icon={faClock} /> <span>Giờ khám:</span>
                                    </div>
                                    <div className="info-right">{doctorSelected.shiftSegment.startTime} - {doctorSelected.shiftSegment.endTime}</div>
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
                                <button disabled={!selectedPayment} onClick={handlePayment}>Thanh toán</button>
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
