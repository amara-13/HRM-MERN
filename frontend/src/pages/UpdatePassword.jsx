import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { resetPasswordApi } from "../../Services/authServices";
import Swal from "sweetalert2";

export default function UpdatePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const token = location.state?.token;
  const [data,setData] = useState({
    email:email,
    token:token,
    password:"",
    confirmPassword:""
  });
  const handleChange = (e)=>{
    const {name,value} = e.target;
    setData((prev)=>({
      ...prev,
    [name]:value,
    }));
  };
  const handleSubmit = async(e)=>{
    e.preventDefault();
     try {
          const response = await resetPasswordApi(data);
          if (!response) {
            Swal.fire({
              title: "Failed",
              text: "Failed to update password",
              icon: "error"
            });
            return;
          }
          Swal.fire({
            title: "Success",
            text: "Password updated successfully",
            icon: "success"
          });
          navigate("/login", {
            state: {
              email: email,
            }
          });
          setData({
            email: "",
            token: "",
            password: "",
            confirmPassword: ""
          });
    
        } catch (error) {
          const errorMsg = error.response?.data?.message || error.message;
          Swal.fire({
            title: "Failed",
            text: errorMsg,
            icon: "error"
          });
        }
  }
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-[#0A1329] border-b border-[#1E293B]/50 sticky top-0 z-50">
        <div className="max-w-[480px] mx-auto px-4 py-3.5 flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-[#2563EB] flex items-center justify-center font-bold text-white shadow-xs">
            P
          </div>
          <span className="font-semibold text-white tracking-tight text-base">
            PeopleHub <span className="text-[#60A5FA] font-medium text-sm ml-0.5">HRM</span>
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[480px] mx-auto px-4 py-12">
        {/* Title & Subtitle */}
        <div className="mb-6 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
            Update Password
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Enter your new password below to update your account credentials.
          </p>
        </div>

        {/* Update Password Form */}
        <form noValidate className="space-y-5" onSubmit={handleSubmit}>
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] space-y-4">
            
            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-1.5" htmlFor="newPassword">
                New password *
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                name="password" onChange={handleChange}
                value={data.password}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all duration-150"
              />
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-1.5" htmlFor="confirmPassword">
                Confirm new password *
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                name="confirmPassword"
                value={data.confirmPassword} onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all duration-150"
              />
            </div>

            {/* Password Hint */}
            <p className="text-xs text-[#64748B]">
              Must be at least 8 characters long with numbers & symbols.
            </p>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-sm font-semibold rounded-xl shadow-xs hover:shadow transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#2563EB]/25"
              >
                Update password
              </button>
            </div>

          </div>

          {/* Back to Login Link */}
          <p className="text-center text-sm text-[#64748B]">
            Back to{' '}
            <Link to = "/login" className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </form>
      </main>
    </div>
  )
}
