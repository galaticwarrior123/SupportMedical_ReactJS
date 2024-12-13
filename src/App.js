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

import Search from './Pages/User/Search/Search';
import BrowsePost from './Pages/User/DoctorPage/BrowsePost/BrowsePost';
import { useEffect } from 'react';
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
        <Route element={<RequireAuth allowedRoles={[ROLES.CLIENT, ROLES.DOCTOR, ROLES.ADMIN]} />}>
          <Route path="/" element={<UserHome />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:id?" element={<Chat />} />
          <Route path="/profile/:id" element={<ProfileUserPage />} />
          <Route path="/appointment/:id?" element={<Appointment />} />
          <Route path="/call/:to" element={<Call />} />
          <Route path="/search" element={<Search />} />
          <Route element={<RequireAuth allowedRoles={[ROLES.DOCTOR]} />}>
            <Route path="permission" element={<BrowsePost />} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/confirm-user" element={<ConfirmUser />} />
        <Route path="/forgot-password" element={<Fill_Email />} />
        <Route path="/reset-password" element={<Fill_NewPassword />} />

        <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN]} />}>
          {/* Route cha cho tất cả các trang quản trị */}
          <Route path="/admin">
            <Route index="categories" element={<CategoryManage />} />
            {/* Các route khác */}
            <Route path="categories" element={<CategoryManage />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="doctors" element={<DoctorManage />} />

            {/* Thêm các route khác nếu cần */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
