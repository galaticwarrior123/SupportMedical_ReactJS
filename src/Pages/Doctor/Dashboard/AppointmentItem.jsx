const AppointmentItem = ({ name, time, type }) => {
  return (
    <div className="appointment-item">
      <img src="your-avatar-placeholder.png" alt="Avatar" />
      <div className="appointment-details">
        <div>{name}</div>
        <div className="appointment-type">{type}</div>
      </div>
      <div className="appointment-time">{time}</div>
    </div>
  );
};

export default AppointmentItem;