import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Pages/Common/Login/Login';
import './App.css';
import UserHome from './Pages/User/HomePage/UserHome';
import Register from './Pages/Common/Register/Register';
import Fill_Email from './Pages/Common/Fill_Email/Fill_Email';
import ConfirmUser from './Pages/Common/ConfirmUser/ConfirmUser';
import { Navigate } from 'react-router-dom';
import RequireAuth from './Components/Utils/RequireAuth';
import Chat from './Pages/User/Chat/Chat';
import ProfileUserPage from './Pages/User/ProfileUserPage/ProfileUserPage';
import CategoryManage from './Pages/Admin/CategoryManage/CategoryManage';
import Fill_NewPassword from './Pages/Common/Fill_NewPassword/Fill_NewPassword';
import Dashboard from './Pages/Admin/Dashboard/Dashboard';
import DoctorManage from './Pages/Admin/DoctorManage/DoctorManage';
import Appointment from './Pages/User/Appointment/Appointment';
import Call from './Pages/User/Call/Call';
import Post from './Pages/User/Post/Post';

import DoctorDashboard from './Pages/Doctor/Dashboard/Dashboard';

import Search from './Pages/User/Search/Search';
import BrowsePost from './Pages/User/DoctorPage/BrowsePost/BrowsePost';
import { useEffect } from 'react';
import Shift from './Pages/Admin/ShiftDoctorManage/Shift/Shift';
import ShiftAssignment from './Pages/Admin/ShiftDoctorManage/ShiftAssignment/ShiftAssignment';
import RegisterMedicalExaminationPage from './Pages/User/RegisterExaminationPage/HomeRegisterMedicalPage/RegisterMedicalExaminationPage';
import CreatePatientRecordPage from './Pages/User/RegisterExaminationPage/CreatePatientRecordPage/CreatePatientRecordPage';

import SelectServicePage from './Pages/User/RegisterExaminationPage/ConfirmRegisterMedicalPage/SelectServicePage/SelectServicePage';
import SelectRecordPage from './Pages/User/RegisterExaminationPage/ConfirmRegisterMedicalPage/SelectRecordPage/SelectRecordPage';
import SelectDayPage from './Pages/User/RegisterExaminationPage/ConfirmRegisterMedicalPage/SelectDayPage/SelectDayPage';
import ManageRecordsPage from './Pages/User/RegisterExaminationPage/LayoutManageRecordsPage/ManageRecordsPage/ManageRecordsPage';
import NotificationsPage from './Pages/User/RegisterExaminationPage/LayoutManageRecordsPage/NotificationsPage/NotificationsPage';
import ConfirmInfoPage from './Pages/User/RegisterExaminationPage/ConfirmRegisterMedicalPage/ConfirmInfoPage/ConfirmInfoPage';
import PatientProfile from './Pages/Doctor/PatientProfile/PatientProfile';
import SelectPaymentPage from './Pages/User/RegisterExaminationPage/ConfirmRegisterMedicalPage/SelectPaymentPage/SelectPaymentPage';
import Schedule from './Pages/Doctor/Schedule/Schedule';
import SelectBankPage from './Pages/User/RegisterExaminationPage/ConfirmRegisterMedicalPage/SelectBankPage/SelectBankPage';
import PaymentSuccess from './Pages/User/RegisterExaminationPage/ConfirmRegisterMedicalPage/PaymentSuccess/PaymentSuccess';
import MyAppointmentsPage from './Pages/User/RegisterExaminationPage/LayoutManageRecordsPage/MyAppointmentsPage/MyAppointmentsPage';
import DetailAppointmentPage from './Pages/User/RegisterExaminationPage/LayoutManageRecordsPage/DetailAppointmentPage/DetailAppointmentPage';
import ShiftSegment from './Pages/Admin/ShiftDoctorManage/ShiftSegment/ShiftSegment';
import MedExamServicePage from './Pages/Admin/MedExamServiceManage/MedExamServicePage';
import ShiftChange from './Pages/Admin/ShiftDoctorManage/ShiftChange/ShiftChange';
import RequestShiftChange from './Pages/Doctor/RequestShiftChange/RequestShiftChange';
import UpdateProfileDoctor from './Pages/Doctor/UpdateProfileDoctor/UpdateProfileDoctor';
import ResultExaminationPage from './Pages/User/RegisterExaminationPage/LayoutManageRecordsPage/ResultExaminationPage/ResultExaminationPage';
const ROLES = {
  'CLIENT': 'CLIENT',
  'DOCTOR': 'DOCTOR',
  'NURSE': 'NURSE',
  'ADMIN': 'ADMIN'
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/confirm-user" element={<ConfirmUser />} />
        <Route path="/forgot-password" element={<Fill_Email />} />
        <Route path="/reset-password" element={<Fill_NewPassword />} />
        <Route>
          <Route path="/">
            <Route index element={<RegisterMedicalExaminationPage />} />
            <Route path="create-patient-record" element={<CreatePatientRecordPage />} />
            <Route path="manage-records" element={<ManageRecordsPage />} />
            <Route path='detail-appointment/:id' element={<DetailAppointmentPage />} />
            <Route path="my-appointments" element={<MyAppointmentsPage />} />
            <Route path="result-examination" element={<ResultExaminationPage />} />
            <Route path="select-service" element={<SelectServicePage />} />
            <Route path="select-record" element={<SelectRecordPage />} />
            <Route path="select-day" element={<SelectDayPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="confirm-info" element={<ConfirmInfoPage />} />
            <Route path="select-payment" element={<SelectPaymentPage />} />
            <Route path="select-bank" element={<SelectBankPage />} />
            <Route path="paymentSuccess" element={<PaymentSuccess />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.DOCTOR]} />}>
            <Route path='/doctor'>
              <Route path='' element={<DoctorDashboard />} />
              <Route path='patient-profile' element={<PatientProfile />} />
              <Route path='schedule' element={<Schedule />} />
              <Route path='shift-change' element={<RequestShiftChange />} />
              <Route path='update-profile' element={<UpdateProfileDoctor />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN]} />}>
            {/* Route cha cho tất cả các trang quản trị */}
            <Route path="/admin">
              <Route index="categories" element={<CategoryManage />} />
              {/* Các route khác */}
              <Route path="categories" element={<CategoryManage />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="doctors" element={<DoctorManage />} />
              <Route path="manage-schedule" element={<Shift />} />
              <Route path="assign-shifts" element={<ShiftAssignment />} />
              <Route path="shift-segment" element={<ShiftSegment />} />
              <Route path="medExamService" element={<MedExamServicePage />} />
              <Route path='shift-change' element={<ShiftChange />} />
              {/* Thêm các route khác nếu cần */}
            </Route>
          </Route>


          {/* Khi nào thêm trang user thì sửa path thành /forum nha az */}
          <Route path="/forum"  element={<RequireAuth allowedRoles={[ROLES.CLIENT, ROLES.DOCTOR, ROLES.ADMIN]} />}>
            <Route index element={<UserHome />} />
            <Route path="post/:id" element={<Post />} />
            <Route path="chat" element={<Chat />} />
            <Route path="chat/:id?" element={<Chat />} />
            <Route path="profile/:id" element={<ProfileUserPage />} />
            <Route path="appointment/:id?" element={<Appointment />} />
            <Route path="call/:to" element={<Call />} />
            <Route path="search" element={<Search />} />
            <Route element={<RequireAuth allowedRoles={[ROLES.DOCTOR]} />}>
              <Route path="permission" element={<BrowsePost />} />
            </Route>
          </Route>
        </Route>



      </Routes>
    </BrowserRouter>
  )
}

export default App;
