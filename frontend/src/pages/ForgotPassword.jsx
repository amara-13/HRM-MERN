import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { sendForgotOtpApi } from "../../Services/authServices";
import Swal from "sweetalert2";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await sendForgotOtpApi({ email });
      if (!response) {
        Swal.fire({
          title: "Failed",
          text: "Failed to verify the given Email",
          icon: "error"
        });
        return;
      }
      navigate("/otp", {
        state: {
          email: email,
          purpose: "forgot"
        }
      });
      setEmail("");

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
            Forgot Password?
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Enter your registered email address and we will send you an OTP to reset your password.
          </p>
        </div>

        {/* Forgot Password Form */}
        <form noValidate className="space-y-5" onSubmit={handleSubmit}>
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] space-y-4">

            {/* Email Address */}
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-1.5" htmlFor="email">
                Email address *
              </label>
              <input
                id="email"
                type="email"
                name="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="ayesha@company.com"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all duration-150"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-sm font-semibold rounded-xl shadow-xs hover:shadow transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#2563EB]/25"
              >
                Send OTP
              </button>
            </div>

          </div>

          {/* Back to Login Link */}
          <p className="text-center text-sm text-[#64748B]">
            Remembered your password?{' '}
            <Link to="/login" className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] hover:underline transition-colors">
              Back to login
            </Link>
          </p>

        </form>
      </main>
    </div>
  )
}
