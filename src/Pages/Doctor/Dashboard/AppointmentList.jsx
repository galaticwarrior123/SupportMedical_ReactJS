import { useEffect, useState } from 'react';
import AppointmentItem from './AppointmentItem';
import { ResultRegistrationAPI } from '../../../API/ResultRegistrationAPI';
import { ResultRegistrationStatus } from '../../../Common/Constants';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  
  useEffect(() => {
    const getTodayAppointments = async () => {
      const today = new Date().toDateString();
      const response = await ResultRegistrationAPI.doctorGetByFilter({
        startDate: today,
        endDate: today,
        status: ResultRegistrationStatus.PENDING,
      });
      setAppointments(response.data);
      console.log(response.data);
    }
    getTodayAppointments();
  }, []);

  return (
    <div className="appointment-list doctor-dashboard-card"> 
      <h2>Cuộc hẹn hôm nay</h2>
      {appointments.map((appointment, index) => (
        <AppointmentItem key={index} item={appointment} />
      ))}
    </div>
  );
};

export default AppointmentList;