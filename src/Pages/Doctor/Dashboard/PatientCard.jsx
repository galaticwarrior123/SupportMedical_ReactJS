import { useDispatch, useSelector } from "react-redux";
import { fetchResultRegistrations, openRecordResultModal } from "../../../redux/slices/doctorDashboardSlice";
import YesNoDialog from "../../../Components/YesNoDialog/YesNoDialog";
import { useState } from "react";
import { ResultRegistrationAPI } from "../../../API/ResultRegistrationAPI";
import { ResultRegistrationStatus } from "../../../Common/Constants";
import { toast } from "react-toastify";

function PatientCard() {
  const dispatch = useDispatch();
  const [openAbsentDialog, setOpenAbsentDialog] = useState(false);
  const { selectedPatient } = useSelector((state) => state.doctorDashboard);
  const openModal = () => {
    dispatch(openRecordResultModal());
  }

  const handleAbsent = () => {
    setOpenAbsentDialog(true);
  }

  const handleConfirmAbsent = async () => {
    try {
      const response = await ResultRegistrationAPI.updateResultRegistration(
        selectedPatient._id,
        {
          status: ResultRegistrationStatus.ABSENT
        }
      );
      dispatch(fetchResultRegistrations());
      toast.success('Ghi nhận bệnh nhân vắng thành công');
      setOpenAbsentDialog(false);
    }
    catch (error) {
      console.error('Error confirming absence:', error);
      toast.error('Ghi nhận bệnh nhân vắng thất bại');
    }
  }

  return selectedPatient &&  (
    <>
      <YesNoDialog
        isOpen={openAbsentDialog}
        onCancel={() => setOpenAbsentDialog(false)}
        onConfirm={handleConfirmAbsent}
        title="Xác nhận vắng"
        message="Bạn có chắc chắn muốn ghi nhận bệnh nhân này vắng?"
        yesText="Đồng ý"
        noText="Hủy bỏ"
      />
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
          <button onClick={handleAbsent} className="absent-button">Vắng</button>
          <button onClick={openModal} className="examined-button">Đã khám</button>
        </div>
      </div>
    </>
  );
}

export default PatientCard;