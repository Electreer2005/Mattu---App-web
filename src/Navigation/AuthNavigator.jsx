import {Routes, Route} from 'react-router-dom';
import Login from './Auth/Login';
import Register from './Auth/Register';
import ForgotPassword from './Auth/ForgotPassword';
import ResetPassword from './Auth/ResetPassword';
import './Auth/Auth.css'

const AuthNavigator = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
    );
};

export default AuthNavigator;