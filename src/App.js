import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Login from './Pages/Common/Login';
import './App.css';
import UserHome from './Pages/User/UserHome';
import Register from './Pages/Common/Register';

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
