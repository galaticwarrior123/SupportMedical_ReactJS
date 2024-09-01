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
        <Route element={<RequireAuth allowedRoles={ROLES.CLIENT} />}>
          <Route path="/" element={<UserHome />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<ProfileUserPage />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/confirm-user" element={<ConfirmUser />} />
        <Route path="/forgot-password" element={<Fill_Email />} />
        <Route path="/reset-password" element={<Fill_NewPassword />} />

        <Route path="/admin/categories" element={<CategoryManage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
