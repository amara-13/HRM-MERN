import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Registration from './pages/Registration.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import OtpVerification from './pages/OtpVerification.jsx'
import UpdatePassword from './pages/UpdatePassword.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/otp" element={<OtpVerification />} />
        <Route path="/reset-password" element={<UpdatePassword/>} />



      </Routes>
    </BrowserRouter>
  )
}

export default App
