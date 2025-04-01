import { useEffect, useState } from 'react';
import AppointmentItem from './AppointmentItem';
import { ResultRegistrationAPI } from '../../../API/ResultRegistrationAPI';
import { ResultRegistrationStatus } from '../../../Common/Constants';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResultRegistrations, setSelectedPatient } from '../../../redux/slices/doctorDashboardSlice';

const AppointmentList = () => {
  const dispatch = useDispatch();
  const { selectedPatient, appointments } = useSelector((state) => state.doctorDashboard);

  useEffect(() => {
    dispatch(fetchResultRegistrations());
  }, []);

  return (
    <div className="appointment-list doctor-dashboard-card">
      <h2>Cuộc hẹn hôm nay</h2>
      {appointments.length === 0 && (
        <div className="no-appointment">
          <p>Không có cuộc hẹn nào trong hôm nay</p>
        </div>
      )}
      {appointments.map((appointment, index) => (
        <AppointmentItem
          isSelected={selectedPatient?._id === appointment._id}
          onClick={() => {
            dispatch(setSelectedPatient(appointment));
          }} key={index} item={appointment} />
      ))}
    </div>
  );
};

export default AppointmentList;