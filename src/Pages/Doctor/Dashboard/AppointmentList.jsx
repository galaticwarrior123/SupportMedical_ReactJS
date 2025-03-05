import AppointmentItem from './AppointmentItem';

const AppointmentList = () => {
  const appointments = [
    { name: 'Nguyễn Văn A', time: '9:00', type: 'TƯ VẤN' },
    { name: 'Nguyễn Văn B', time: '9:00', type: 'TÁI KHÁM' },
    { name: 'Nguyễn Văn C', time: '10:00', type: 'ĐỊNH KỲ' },
  ];

  return (
    <div className="appointment-list"> 
      <h2>Cuộc hẹn hôm nay</h2>
      {appointments.map((appointment, index) => (
        <AppointmentItem key={index} {...appointment} />
      ))}
    </div>
  );
};

export default AppointmentList;