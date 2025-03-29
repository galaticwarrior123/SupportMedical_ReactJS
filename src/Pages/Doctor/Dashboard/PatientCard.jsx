import { useDispatch, useSelector } from "react-redux";
import { openRecordResultModal } from "../../../redux/slices/doctorDashboardSlice";

function PatientCard() {
  const dispatch = useDispatch();
  const { selectedPatient } = useSelector((state) => state.doctorDashboard);
  const openModal = () => {
    dispatch(openRecordResultModal());
  }

  return selectedPatient &&  (
    <div className="patient-card doctor-dashboard-card">
      <div className="patient-card-header">
        <div className="dashboard-patient-info">
          <h2 className="patient-name">{selectedPatient?.recordPatient.name}</h2>
          <p className="patient-details">{selectedPatient?.recordPatient.gender ? 'Nam' : 'Nữ'} - {selectedPatient.recordPatient.province}</p>
          <p className="patient-details">{selectedPatient?.recordPatient.dob}</p>
        </div>
      </div>
      <div className="patient-notes">
        <p>Ghi chú của bệnh nhân:</p>
        <ul>
          <li>Triệu chứng ho, nghẹt mũi</li>
        </ul>
      </div>
      <div className="previous-visit">
        <p>Lần khám trước: Với bác sĩ Phúc vào 20 thg 11, 2024</p>
        <p>Triệu chứng: nhứt đầu nhẹ, hoa mắt</p>
        <p>Kết luận: cảm cúm</p>
        <p>Kê đơn: paracetamol - 2 lần một ngày</p>
      </div>
      <div className="status-buttons">
        <button className="absent-button">Vắng</button>
        <button onClick={openModal} className="examined-button">Đã khám</button>
      </div>
    </div>
  );
}

export default PatientCard;