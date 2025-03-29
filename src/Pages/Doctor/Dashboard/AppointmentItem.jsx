import { useDispatch, useSelector } from "react-redux";
import { setSelectedPatient } from "../../../redux/slices/doctorDashboardSlice";

const AppointmentItem = ({ item }) => {
  const dispatch = useDispatch();
  const { selectedPatient } = useSelector((state) => state.doctorDashboard);

  return (
    <div onClick={() => {
      dispatch(setSelectedPatient(item));
    }} className={`appointment-item ${selectedPatient?._id === item._id ? 'selected' : ''}`} >
      <div className="appointment-details">
        <div>{item.recordPatient.name}</div>
        <div className="appointment-type">{item.medExamService.name}</div>
      </div>
      <div className="doctor-appointment-time">{`${item.shiftSegment.startTime} - ${item.shiftSegment.endTime}`}</div>
    </div>
  );
};

export default AppointmentItem;