// SpeechRecognize.jsx
import { useEffect, useRef, useState } from 'react';
// import './SpeechRecognize.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { MedExamServiceAPI } from '../../../../API/MedExamServiceAPI';
import { RecordPatientAPI } from '../../../../API/RecordPatientAPI';
import { toast } from 'react-toastify';

const SpeechRecognize = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const bookingDataRef = useRef({ user: user._id });
    const [isListening, setIsListening] = useState(false);
    const [step, setStep] = useState(1);
    const [department, setDepartment] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [conversation, setConversation] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [typingText, setTypingText] = useState('');
    const [textInput, setTextInput] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [recordList, setRecordList] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [personalInfo, setPersonalInfo] = useState({
        fullName: '',
        phone: '',
        dob: '',
        gender: '',
        address: ''
    });

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.interimResults = false;

    useEffect(() => {
        const greeting = "Xin chào, tôi là trợ lý tư vấn đặt lịch khám. Cho hỏi bạn gặp triệu chứng gì vậy để tôi có thể xem xét chọn bác sĩ phù hợp?";
        const synth = window.speechSynthesis;
        const speakGreeting = () => {
            speakWithFPT(greeting);
            typeBotMessage(greeting);
        };

        if (synth.getVoices().length === 0) {
            synth.onvoiceschanged = () => speakGreeting();
        } else {
            speakGreeting();
        }
    }, []);

    const recognitionStart = () => {
        try {
            recognition.start();
            setIsListening(true);
        } catch (error) {
            console.error("Lỗi khi bắt đầu:", error);
        }
    };

    const recognitionEnd = () => setIsListening(false);
    recognition.onend = recognitionEnd;

    recognition.onresult = async (event) => {
        const userSpeech = event.results[0][0].transcript;
        handleUserInput(userSpeech);
    };

    const handleTextSubmit = () => {
        if (textInput.trim()) {
            handleUserInput(textInput);
            setTextInput('');
        }
    };

    const handleUserInput = async (inputText) => {
        addMessage('user', inputText);

        if (step === 1) {
            const response = await getBotReply(inputText);

            if (response.department_match === true) {
                setDepartment(response.answer);
                setStep(2);
                saveBotReplyToLocal(response.answer);
                // speakWithFPT(response.answer);
                setTimeout(async () => {
                    const followUp = "Bạn chọn thời gian phù hợp để tôi tìm kiếm bác sĩ phù hợp.";
                    speakWithFPT(followUp);
                    await typeBotMessage(followUp);
                }, 2000);
            } else {
                const retryMsg = response.answer || "Tôi chưa xác định được chuyên khoa, bạn có thể nói rõ hơn không?";
                speakWithFPT(retryMsg);
                typeBotMessage(retryMsg);
            }
        } else if (step === 2) {
            if (!inputText.trim()) {
                const retryMsg = "Tôi chưa nghe rõ thời gian, bạn có thể nói lại được không?";
                speakWithFPT(retryMsg);
                await typeBotMessage(retryMsg);
                return;
            }

            setTimeSlot(inputText);
            setStep(3);

            // const confirm = `Bạn muốn khám vào thời gian: "${inputText}". Tôi sẽ tìm bác sĩ phù hợp cho chuyên khoa "${department}".`;
            // speakWithFPT(confirm);
            // typeBotMessage(confirm);

            const response = await getBotReplyForResutl(inputText);
            console.log("Response from server:", response);
            if (Array.isArray(response.doctors) && response.doctors.length > 0) {
                const result = `Dưới đây là danh sách bác sĩ phù hợp với yêu cầu của bạn. Bạn có thể chọn bác sĩ mà bạn muốn khám.`;
                await typeBotMessage(result);
                speakWithFPT(result);
                addMessage('bot', '', 'doctor-list', response.doctors);
            } else {
                const errorMsg = "Khung giờ này không có bác sĩ khám cho bạn, bạn vui lòng chọn thời gian khác.";
                localStorage.removeItem('botReplies');
                speakWithFPT(errorMsg);
                await typeBotMessage(errorMsg);
                setStep(2);
            }
        }

        setIsListening(false);
    };

    const handleDoctorSelect = async (doctor) => {
        setSelectedDoctor(doctor);
        bookingDataRef.current.doctor = doctor.doctor._id;
        bookingDataRef.current.shiftSegment = doctor.shiftSegments[0]._id;
        const msg = `Bạn đã chọn bác sĩ ${doctor.doctor.firstName} ${doctor.doctor.lastName}. Chúng tôi có các dịch vụ khám, vui lòng chọn dịch vụ bên dưới.`;
        speakWithFPT(msg);
        await typeBotMessage(msg);

        try {
            const response = await MedExamServiceAPI.getMedExamServices();
            addMessage('bot', '', 'service-list', response.data);
        } catch (error) {
            console.error("Lỗi lấy danh sách dịch vụ:", error);
            speakWithFPT("Có lỗi xảy ra khi lấy danh sách dịch vụ.");
            typeBotMessage("Có lỗi xảy ra khi lấy danh sách dịch vụ.");
        }
    };

    const handleServiceSelect = async (service) => {
        const msg = `Bạn đã chọn dịch vụ: ${service.name} với giá ${service.fee.toLocaleString('vi-VN')} VND. Vui lòng chọn hồ sơ bệnh nhân để tôi có thể đặt lịch khám cho bạn.`;
        speakWithFPT(msg);
        await typeBotMessage(msg);
        bookingDataRef.current.medExamService = service._id;
        bookingDataRef.current.fee = service.fee;

        setShowInfoModal(true);
    };

    const saveBotReplyToLocal = (reply) => {
        const existing = JSON.parse(localStorage.getItem('botReplies') || '[]');
        localStorage.setItem('botReplies', JSON.stringify([...existing, reply]));
    };

    const getBotReply = async (message) => {
        try {
            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: message })
            });
            return await response.json();
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            return { answer: "Có lỗi xảy ra khi kết nối đến máy chủ." };
        }
    };

    const getBotReplyForResutl = async (message) => {
        const botReply = localStorage.getItem('botReplies');
        if (botReply) {
            try {
                const response = await fetch('http://localhost:5000/get-doctors', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question: message, botReply })
                });
                return await response.json();
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
                return { answer: "Có lỗi xảy ra khi kết nối đến máy chủ." };
            }
        }
        return { answer: "Không tìm thấy thông tin." };
    };

    const speakWithFPT = async (text) => {
        const apiKey = '7YdCVkbIL4exHh8BkBRi2SE8epMwZcUd';
        const url = 'https://api.fpt.ai/hmi/tts/v5';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'api-key': apiKey,
                    'speed': '0',
                    'voice': 'banmai',
                    'Content-Type': 'text/plain'
                },
                body: text
            });

            const data = await response.json();

            if (data && data.async) {
                setTimeout(() => {
                    const audio = new Audio(data.async);
                    audio.play().catch(err => console.error("Lỗi khi phát audio:", err));
                }, 1000);
            } else {
                console.error("Không lấy được link audio.");
            }
        } catch (error) {
            console.error("Lỗi gọi API FPT TTS:", error);
        }
    };

    const addMessage = (sender, text, type = 'text', data = null) => {
        setConversation(prev => [...prev, { sender, text, type, data }]);
    };

    const typeBotMessage = (text) => {
        return new Promise((resolve) => {
            setIsTyping(true);
            setTypingText(text[0]);
            let index = 0;
            const interval = setInterval(() => {
                if (index < text.length) {
                    setTypingText(prev => prev + text[index]);
                    index++;
                } else {
                    clearInterval(interval);
                    setIsTyping(false);
                    addMessage('bot', text);
                    resolve(); // Chờ xong typing thì resolve
                }
            }, 30);
        });
    };

    useEffect(() => {
        const fetchRecordPatientList = async () => {
            try {
                const response = await RecordPatientAPI.getRecordPatientList(user._id);
                setRecordList(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách bệnh nhân:", error);
            }
        };
        fetchRecordPatientList();
    }, [user._id]);

    return (
        <div className="speech-recognize">
            <h1>🩺 Trợ lý đặt lịch khám</h1>
            <div className='chat-box-layout'>
                <div className="chat-box">
                    {conversation.map((msg, idx) => (
                        <div key={idx} className={`chat-message ${msg.sender}`}>
                            <strong>{msg.sender === 'user' ? '🧑 Bạn' : '🤖 Bot'}:</strong>
                            {msg.type === 'text' && <span> {msg.text}</span>}
                            {msg.type === 'doctor-list' && (
                                <div className="doctors-inline">
                                    {msg.data.map((doctor, index) => (
                                        <div className="doctor-card-item" key={index}>
                                            <img src={doctor.doctor.avatar} alt="avatar" />
                                            <div className="info">
                                                <h3>BS. {doctor.doctor.firstName} {doctor.doctor.lastName}</h3>
                                                <p><strong>Ngày sinh:</strong> {new Date(doctor.doctor.dob).toLocaleDateString('vi-VN')}</p>
                                                <p><strong>Điện thoại:</strong> {doctor.doctor.doctorInfo?.phone || 'Không có'}</p>
                                                <p><strong>Chuyên khoa:</strong> {doctor.doctor.doctorInfo?.specialities[0]?.name || 'Không có'}</p>
                                                <p><strong>Chuyên trị:</strong> {doctor.doctor.doctorInfo?.treatment || 'Chưa cập nhật'}</p>
                                                <button onClick={() => handleDoctorSelect(doctor)}>Chọn</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {msg.type === 'service-list' && (
                                <div className="services-inline">
                                    {msg.data.map((service, index) => (
                                        <div className="service-card-item" key={index}>
                                            <h4>{service.name}</h4>
                                            <p>Giá: {service.fee.toLocaleString('vi-VN')} VND</p>
                                            <button onClick={() => handleServiceSelect(service)}>Chọn dịch vụ</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {showInfoModal && (
                                <div className="modal-overlay-info-speech">
                                    <div className="modal-info-speech-content">
                                        <h2>Chọn hồ sơ bệnh nhân</h2>

                                        {!showCreateForm ? (
                                            <>
                                                {recordList.length > 0 ? (
                                                    <ul className="record-list">
                                                        {recordList.map((record, index) => (
                                                            <li key={index} className="record-list-card">
                                                                <div className="record-list-card-info">
                                                                    <div className="info-columns">
                                                                        <p><strong>Họ và tên:</strong> {record.name}</p>
                                                                        <p><strong>Ngày sinh:</strong> {new Date(record.dob).toLocaleDateString('vi-VN')}</p>
                                                                        <p><strong>Giới tính:</strong> {record.gender === true ? "Nam" : "Nữ"}</p>
                                                                        <p><strong>Điện thoại:</strong> {record.phoneNumber}</p>
                                                                    </div>
                                                                    <p className="address">
                                                                        <strong>Địa chỉ:</strong> {record.address}, {record.ward}, {record.district}, {record.province}
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    className="select-button"
                                                                    onClick={async () => {
                                                                        setShowInfoModal(false);
                                                                        // typeBotMessage(`Đã chọn hồ sơ của ${record.name}.`);
                                                                        // speakWithFPT(`Đã chọn hồ sơ của ${record.name}.`);
                                                                        bookingDataRef.current.recordPatient = record._id;

                                                                        const confirmData = {
                                                                            doctorName: `${selectedDoctor.doctor.firstName} ${selectedDoctor.doctor.lastName}`,
                                                                            department: `${selectedDoctor.doctor.doctorInfo?.specialities[0]?.name || ''}`,
                                                                            timeSlot: `${selectedDoctor.shiftSegments[0].startTime} - ${selectedDoctor.shiftSegments[0].endTime}`,
                                                                            serviceName: conversation.find(msg => msg.type === 'service-list')?.data?.find(s => s._id === bookingDataRef.current.medExamService)?.name || '',
                                                                            fee: bookingDataRef.current.fee,
                                                                            fullName: record.name,
                                                                            phone: record.phoneNumber,
                                                                            dob: record.dob,
                                                                            gender: record.gender,
                                                                            address: `${record.address}, ${record.ward}, ${record.district}, ${record.province}`
                                                                        };



                                                                        const confirmMsg = `Bạn đã chọn hồ sơ thành công. Vui lòng kiểm tra lại thông tin trước khi xác nhận và tiến hành thanh toán.`;
                                                                        speakWithFPT(confirmMsg);
                                                                        await typeBotMessage(confirmMsg);
                                                                        addMessage('bot', '', 'confirm-appointment', confirmData);
                                                                    }}
                                                                >
                                                                    Chọn
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p>Không tìm thấy hồ sơ nào.</p>
                                                )}
                                                <div className='modal-buttons'>
                                                    <button onClick={() => setShowCreateForm(true)} className='btn-add-record'>+ Thêm hồ sơ mới</button>
                                                    <button onClick={() => setShowInfoModal(false)} className='btn-cancel-add'>Hủy</button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div style={{ display: 'flex', gap: '20px' }}>
                                                    {/* Cột bên trái */}
                                                    <div style={{ flex: 1 }}>
                                                        <h3>Tạo hồ sơ mới</h3>

                                                        <label>Họ và tên:</label>
                                                        <input
                                                            type="text"
                                                            value={personalInfo.fullName}
                                                            onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                                                        />

                                                        <label>Ngày sinh:</label>
                                                        <input
                                                            type="date"
                                                            value={personalInfo.dob}
                                                            onChange={(e) => setPersonalInfo({ ...personalInfo, dob: e.target.value })}
                                                        />

                                                        <label>Tỉnh:</label>
                                                        <select>
                                                            <option>Chọn</option>
                                                        </select>

                                                        <label>Chọn xã/phường</label>
                                                        <select>
                                                            <option>Chọn</option>
                                                        </select>
                                                    </div>

                                                    {/* Cột bên phải */}
                                                    <div style={{ flex: 1 }}>
                                                        <label>Số điện thoại:</label>
                                                        <input
                                                            type="tel"
                                                            value={personalInfo.phone}
                                                            onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                                                        />

                                                        <label>Giới tính:</label>
                                                        <select
                                                            value={personalInfo.gender}
                                                            onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                                                        >
                                                            <option value="">Chọn</option>
                                                            <option value="Nam">Nam</option>
                                                            <option value="Nữ">Nữ</option>
                                                            <option value="Khác">Khác</option>
                                                        </select>

                                                        <label>Chọn quận/huyện:</label>
                                                        <select>
                                                            <option>Chọn</option>
                                                        </select>

                                                        <label>Địa chỉ:</label>
                                                        <input
                                                            type="text"
                                                            value={personalInfo.address}
                                                            onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="modal-buttons" style={{ marginTop: '20px', textAlign: 'center' }}>
                                                    <button onClick={async () => {
                                                        try {
                                                            await RecordPatientAPI.createRecord(personalInfo);
                                                            setShowCreateForm(false);
                                                            speakWithFPT("Đã tạo hồ sơ mới.");
                                                            typeBotMessage("Đã tạo hồ sơ mới.");
                                                            setShowInfoModal(false);
                                                        } catch (err) {
                                                            toast.error("Có lỗi xảy ra khi tạo hồ sơ mới.");
                                                        }
                                                    }}>Tạo hồ sơ</button>
                                                    <button onClick={() => setShowCreateForm(false)}>Quay lại</button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}


                            {msg.type === 'confirm-appointment' && (
                                <div className="confirm-appointment-container">
                                    <h3>Xác nhận đặt lịch khám</h3>
                                    <div className="confirm-appointment-grid">
                                        <div className="appointment-confirm-info">
                                            <h4>Thông tin khám</h4>
                                            <p><strong>Bác sĩ:</strong> {msg.data.doctorName}</p>
                                            <p><strong>Chuyên khoa:</strong> {msg.data.department}</p>
                                            <p><strong>Thời gian:</strong> {msg.data.timeSlot}</p>
                                            <p><strong>Dịch vụ:</strong> {msg.data.serviceName}</p>
                                            <p><strong>Giá:</strong> {msg.data.fee.toLocaleString('vi-VN')} VND</p>
                                        </div>
                                        <div className="patient-confirm-info">
                                            <h4>Thông tin bệnh nhân</h4>
                                            <p><strong>Họ và tên:</strong> {msg.data.fullName}</p>
                                            <p><strong>Điện thoại:</strong> {msg.data.phone}</p>
                                            <p><strong>Ngày sinh:</strong> {new Date(msg.data.dob).toLocaleDateString('vi-VN')}</p>
                                            <p><strong>Giới tính:</strong> {msg.data.gender === true ? "Nam" : "Nữ"}</p>
                                            <p><strong>Địa chỉ:</strong> {msg.data.address}</p>
                                        </div>
                                    </div>
                                    <div className="button-group">
                                        <button className='btn-confirm-button'>Xác nhận</button>
                                        <button className='btn-cancel-button'>Hủy</button>
                                    </div>
                                </div>
                            )}

                        </div>
                    ))}
                    {isTyping && (
                        <div className="chat-message bot">
                            <strong>🤖 Bot:</strong> {typingText}<span className="blinking-cursor">|</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="input-container">
                <div className="input-wrapper">
                    <input
                        type="text"
                        placeholder="Nhập tin nhắn..."
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
                    />
                    <button className="icon-button" onClick={recognitionStart} disabled={isListening} title="Nói">
                        <FontAwesomeIcon icon={faMicrophone} />
                    </button>
                    <button className="icon-button" onClick={handleTextSubmit} title="Gửi">
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </div>
            </div>
        </div >
    );
};

export default SpeechRecognize;
