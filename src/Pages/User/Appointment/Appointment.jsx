import DefaultLayout from '../../../Layouts/DefaultLayout/DefaultLayout';
import './Appointment.css';
import { formatDate } from "date-fns";
import { useCallback, useEffect, useState } from 'react';
import ApptItem from './ApptItem/ApptItem';
import { AppointmentAPI } from '../../../API/AppointmentAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import YesNoDialog from '../../../Components/YesNoDialog/YesNoDialog';
import { AppointmentStatus } from '../../../API/ChatAPI';
import { useSocket } from '../../../context/SocketProvider';
import { useNavigate, useParams } from 'react-router-dom';


const Appointment = () => {
    const socket = useSocket();
    const { id } = useParams();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedAppt, setSelectedAppt] = useState(null);
    const [apptList, setApptList] = useState([]);
    const [filter, setFilter] = useState({
        q: '',
        month: 0,
        year: new Date().getFullYear()
    });

    const months = Array.from({ length: 12 }, (_, i) => {
        return {
            value: i + 1,
            label: `Tháng ${i + 1}`
        }
    });

    const years = Array.from({ length: 10 }, (_, i) => {
        return {
            value: 2024 + i,
            label: `Năm ${2024 + i}`
        }
    });

    const handleSearch = async () => {
        const response = await AppointmentAPI.getAppointmentList(filter);
        setApptList(response.data);
    }

    const getAppointmentList = useCallback(async () => {
        const response = await AppointmentAPI.getAppointmentList(filter);
        setApptList(response.data);
        setSelectedAppt(response.data[0]);
    }, [filter]);

    useEffect(() => {
        getAppointmentList();
        if (id) {
            setSelectedAppt(apptList.find(appt => appt._id === id));
        }
    }, [id, apptList, getAppointmentList]);

    const onFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter({
            ...filter,
            [name]: value
        });
    }

    return (
        <DefaultLayout>
            <YesNoDialog
                isOpen={showModal}
                onCancel={() => setShowModal(false)}
                onConfirm={() => {
                    socket.emit('update-appt-message-status', {
                        messageId: selectedAppt.message,
                        status: AppointmentStatus.CANCELLED,
                    });
                    setShowModal(false);
                    getAppointmentList();
                }}
                yesText='Đồng ý'
                noText='Hủy'
                title='Xác nhận hủy cuộc hẹn'
                message='Thao tác này không thể hoàn tác, bạn có chắc chắn muốn hủy cuộc hẹn này không?'
            />
            <div className="appointment">
                <div className="card appt-list-card">
                    <div className='card-header'>
                        <div className="card-title">
                            <span>Danh sách cuộc hẹn</span>
                        </div>
                        <div className="search">
                            <input
                                name='q'
                                onChange={onFilterChange}
                                value={filter.q}
                                type="text" placeholder="Tìm kiếm..." />
                            <button onClick={handleSearch} className="btn-search">
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </div>
                        <div className="search-filter">
                            {/* chọn tháng và năm */}
                            <select className="select-box" name="month" value={filter.month} onChange={onFilterChange}>
                                <option value={0}>Tháng</option>
                                {
                                    months.map((month, index) => {
                                        return <option key={index} value={month.value}>{month.label}</option>
                                    })
                                }

                            </select>
                            <select className="select-box" name="year" value={filter.year} onChange={onFilterChange}>
                                {
                                    years.map((year, index) => {
                                        return <option key={index} value={year.value}>{year.label}</option>
                                    })
                                }
                            </select>

                        </div>
                    </div>

                    <div className="appt-list">
                        {
                            apptList.map((appt, index) => {
                                return <ApptItem onClick={() => navigate(`/appointment/${appt._id}`)} key={index} appt={appt} />
                            })
                        }
                        {
                            apptList.length === 0 && (
                                <div className="empty-list">
                                    <span>Không có cuộc hẹn nào</span>
                                </div>
                            )
                        }
                    </div>

                </div>
                <div className="card appt-detail">
                    <div className="card-header">
                        <div style={{ textAlign: 'center' }} className="card-title">
                            <span>Chi tiết cuộc hẹn</span>
                        </div>
                    </div>
                    <div className="card-body">
                        {
                            selectedAppt && (
                                <div>
                                    <div className="appt-time">
                                        <span>Thời gian: <strong>{formatDate(selectedAppt.date, "HH:mm dd/MM/yyyy")}</strong> </span>
                                    </div>
                                    <div className="appt-title">
                                        <span>Tiêu đề: <strong>{selectedAppt.title}</strong></span>
                                    </div>
                                    <div className="appt-content">
                                        <span>Nội dung:</span>
                                        <pre style={{ fontFamily: 'inherit', margin: '4px' }}>{selectedAppt.content}</pre>
                                    </div>
                                </div>
                            )
                        }
                    </div>

                    <div className="card-footer">
                        <button onClick={() => {
                            if (selectedAppt) {
                                setShowModal(true);
                            }
                        }} className="btn-cancel">Hủy cuộc hẹn</button>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default Appointment;