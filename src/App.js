import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Login from './Pages/Common/Login';
import './App.css';
import UserHome from './Pages/User/UserHome';

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserHome />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
