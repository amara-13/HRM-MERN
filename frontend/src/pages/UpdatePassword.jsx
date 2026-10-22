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
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-primary-dk border-b border-muted/20 sticky top-0 z-50">
        <div className="max-w-[480px] mx-auto px-4 py-3.5 flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center font-bold text-white shadow-xs">
            P
          </div>
          <span className="font-semibold text-white tracking-tight text-base">
            PeopleHub <span className="text-muted font-medium text-sm ml-0.5">HRM</span>
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[480px] mx-auto px-4 py-12">
        {/* Title & Subtitle */}
        <div className="mb-6 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-ink tracking-tight">
            Update Password
          </h1>
          <p className="mt-1 text-sm text-ink/70">
            Enter your new password below to update your account credentials.
          </p>
        </div>

        {/* Update Password Form */}
        <form noValidate className="space-y-5" onSubmit={handleSubmit}>
          <div className="bg-canvas border border-muted rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(113,63,50,0.06)] space-y-4">
            
            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5" htmlFor="newPassword">
                New password *
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                name="password" onChange={handleChange}
                value={data.password}
                className="w-full px-3.5 py-2.5 text-sm bg-canvas border border-muted rounded-xl text-ink placeholder:text-ink/40 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all duration-150"
              />
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5" htmlFor="confirmPassword">
                Confirm new password *
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                name="confirmPassword"
                value={data.confirmPassword} onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-canvas border border-muted rounded-xl text-ink placeholder:text-ink/40 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all duration-150"
              />
            </div>

            {/* Password Hint */}
            <p className="text-xs text-ink/70">
              Must be at least 8 characters long with numbers & symbols.
            </p>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-6 bg-primary hover:bg-primary-dk text-white text-sm font-semibold rounded-xl shadow-xs hover:shadow transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/25"
              >
                Update password
              </button>
            </div>

          </div>

          {/* Back to Login Link */}
          <p className="text-center text-sm text-ink/70">
            Back to{' '}
            <Link to = "/login" className="font-semibold text-primary hover:text-primary-dk hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </form>
      </main>
    </div>
  )
}
