import { useDispatch, useSelector } from "react-redux";
import { fetchResultRegistrations, openRecordResultModal } from "../../../redux/slices/doctorDashboardSlice";
import YesNoDialog from "../../../Components/YesNoDialog/YesNoDialog";
import { useState } from "react";
import { ResultRegistrationAPI } from "../../../API/ResultRegistrationAPI";
import { ResultRegistrationStatus } from "../../../Common/Constants";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIdCard } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";
import { format } from "date-fns";

function PatientCard() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  console.log("Selected patient:", selectedPatient);

  return selectedPatient && (
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
          <button onClick={
            () => {
              navigate(`/doctor/patient-profile/${selectedPatient.recordPatient._id}`);
            }
          } className="btn-profile">
            <FontAwesomeIcon icon={faIdCard} className="patient-icon" fontSize={20} />
          </button>
        </div>
        <div className="patient-notes">
          <p>Ghi chú của bệnh nhân:</p>
          <ul>
            <li>{selectedPatient.description ?? "(trống)"}</li>
          </ul>
        </div>
        <div className="previous-visit">
          {
            selectedPatient?.latestVisit && (
              <>
                <p>
                  Lần khám trước: Với {
                    selectedPatient?.latestVisit.doctor._id === user._id
                      ? "bạn"
                      : <Link to={`/forum/profile/${selectedPatient?.latestVisit.doctor._id}`}>Bác sĩ {selectedPatient?.latestVisit.doctor.lastName}</Link>
                  } vào {format(new Date(selectedPatient?.latestVisit.createdAt), "dd 'thg' MM',' yyyy")}
                </p>
                <p>Triệu chứng: {selectedPatient?.latestVisit.symptoms}</p>
                <p>Kết luận: {selectedPatient?.latestVisit.result}</p>
                <p>Kê đơn: {selectedPatient?.latestVisit.prescription}</p>
              </>
            )
          }

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