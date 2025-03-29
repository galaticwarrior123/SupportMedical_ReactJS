import React, { useEffect, useState } from 'react';
import DefaultLayoutRegisterMedicalExaminationPage from '../../../../../Layouts/DefaultLayoutRegisterMedicalExaminationPage/DefaultLayoutRegisterMedicalExaminationPage';
import './SelectBankPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { PaymentAPI } from '../../../../../API/PaymentAPI';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';


const SelectBankPage = () => {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));
    const doctorSelected = location.state;
    const [banks, setBanks] = useState([]);

    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const response = await fetch('https://api.vietqr.io/v2/banks');
                const data = await response.json();
                setBanks(data.data);
            } catch (error) {
                console.error('Error fetching banks:', error);
            }
        };

        fetchBanks();
    }, []);

    const handleBankClick = (bankCode) => {
        const payment = {
            amount: doctorSelected.medExamService.fee,
            bankCode: bankCode,
        };

        const data = {
            user: user._id,
            doctor: doctorSelected.doctor._id,
            recordPatient: doctorSelected.record._id,
            shiftSegment: doctorSelected.shiftSegment._id,
            medExamService: doctorSelected.medExamService._id,
            fee: doctorSelected.medExamService.fee,
            description: doctorSelected.description,
        };

        // Nếu tạo đăng ký khám thành công thì gọi tiếp API thanh toán
        PaymentAPI.createPaymentUrl(payment)
            .then((response) => {
                localStorage.setItem('recordPatient', JSON.stringify(data));
                window.location.href = response.data.paymentUrl;
            })
            .catch((error) => {
                toast.error('Có lỗi xảy ra khi tạo đơn thanh toán');
            });

    };


    return (
        <DefaultLayoutRegisterMedicalExaminationPage>
            <div className="select-bank-page">
                <div className="select-bank-container">
                    <div className="table-header-bank">Vui lòng chọn ngân hàng thanh toán</div>
                    <div className="bank-table">
                        {banks.length > 0 && (
                            <table>
                                <tbody>
                                    {Array.from({ length: Math.ceil(banks.length / 4) }).map((_, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {banks.slice(rowIndex * 4, rowIndex * 4 + 4).map((bank) => (
                                                <td key={bank.code}>
                                                    <button className="bank-button" onClick={() => handleBankClick(bank.code)}>
                                                        <img src={bank.logo} alt={bank.name} className="bank-logo" />
                                                    </button>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                </div>

                <div className="button-container-bank">
                    <button className="previous-button" onClick={() => window.history.back()}>
                        <FontAwesomeIcon icon={faArrowLeft} className="icon" />
                        Quay lại
                    </button>
                </div>
            </div>
        </DefaultLayoutRegisterMedicalExaminationPage>
    );
};

export default SelectBankPage;
