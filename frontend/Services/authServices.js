import axios from "axios";
const url =  "http://localhost:5000";

export const registerApi = async(formData)=>{
    const response = await axios.post(`${url}/auth/register`,formData);
    return response.data;
}
export const verifiyOtpApi = async(data)=>{
    const response = await axios.post(`${url}/auth/otp`,data);
    return response.data;
}
export const loginApi = async(data)=>{
    const response = await axios.post(`${url}/auth/login`,data);
    return response.data;
}
export const verifyEmailApi = async(data)=>{
    const response = await axios.post(`${url}/auth/verify-forgot-email`,data);
    return response.data;
}
export const sendForgotOtpApi = async(data)=>{
    const response = await axios.post(`${url}/auth/forgot-otp`,data);
    return response.data;
}
export const verifyForgotOtpApi = async(data)=>{
    const response = await axios.post(`${url}/auth/verify-forgot-otp`,data);
    return response.data;
}
export const  resetPasswordApi = async(data)=>{
    const response = await axios.post(`${url}/auth/reset-password`,data);
    return response.data;
}