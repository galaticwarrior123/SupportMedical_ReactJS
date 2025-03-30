const AppointmentItem = ({ item, onClick, isSelected = false }) => {

  return (
    <div onClick={onClick} className={`appointment-item ${isSelected ? 'selected' : ''}`} >
      <div className="appointment-details">
        <div>{item.recordPatient.name}</div>
        <div className="appointment-type">{item.medExamService.name}</div>
      </div>
      <div className="doctor-appointment-time">{`${item.shiftSegment.startTime} - ${item.shiftSegment.endTime}`}</div>
    </div>
  );
};

export default AppointmentItem;