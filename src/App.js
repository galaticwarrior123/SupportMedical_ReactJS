import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Login from './Pages/Common/Login/Login';
import './App.css';
import UserHome from './Pages/User/UserHome';
import Register from './Pages/Common/Register/Register';
import Fill_Email from './Pages/Common/Fill_Email/Fill_Email';
import ConfirmUser from './Pages/Common/ConfirmUser/ConfirmUser';
import { Navigate } from 'react-router-dom';
function App() {
  const isAuthenticated = () => {
    return !! localStorage.getItem('token');
  };
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuthenticated()? <UserHome/> : <Navigate to="/login"/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/confirm-user" element={<ConfirmUser />} />
        <Route path="/forgot-password" element={<Fill_Email />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
