import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Login from './Pages/Common/Login/Login';
import './App.css';
import UserHome from './Pages/User/UserHome';
import Register from './Pages/Common/Register/Register';
import Fill_Email from './Pages/Common/Fill_Email/Fill_Email';
import Fill_Code from './Pages/Common/Fill_Code/Fill_Code';
import Fill_NewPassword from './Pages/Common/Fill_NewPassword/Fill_NewPassword';

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/forgot-password/fill-email" element={<Fill_Email />} />
        <Route path="/forgot-password/fill-code" element={<Fill_Code />} />
        <Route path="/forgot-password/fill-new-password" element={<Fill_NewPassword />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App;
