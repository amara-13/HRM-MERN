import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { verifiyOtpApi,verifyForgotOtpApi } from "../../Services/authServices";
import Swal from "sweetalert2";


export default function OtpVerification() {
  const location = useLocation();
  const navigate = useNavigate();
  const purpose = location.state?.purpose;
  console.log("purpose:", purpose);
  const [otp, setOtp] = useState({
    otpCode:
      ["", "", "", "", "", ""],
  });
  const handleChange = (e, digitIndex) => {
    const { value } = e.target;
    setOtp((prev) => ({
      ...prev,
      otpCode: prev.otpCode.map((digit, index) => index === digitIndex ? value : digit),
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const email = location.state?.email;
      const otpdata = otp.otpCode.join("");
      let response = "";
      if (purpose === "forgot") {
        const responses = await verifyForgotOtpApi({ email, otpCode: otpdata });
        response = responses
      } else {
        const responses = await verifiyOtpApi({ email, otpCode: otpdata });
        response = responses
      }
      if (response) {
        console.log(email, otpdata);
           Swal.fire({
            title: "Success",
            text: "verify your email successfully",
            icon: "success"
          });
          if (purpose === "forgot") {
            navigate("/reset-password", {
              state: {
                email: location.state?.email || "",token:response.token,
              }
            });
          } else {
            navigate("/login", {
              state: {
                email: location.state?.email || ""
              }
            });
          }


        }
      }
    catch (error) {
      console.log("ACTUAL ERROR:", error.message, error);
      const errorMsg = error.response?.data?.message || "Failed to verify your email";
      Swal.fire({
        title: "Failed",
        text: errorMsg,
        icon: "error"
      });
    }
  }
  console.log(location);
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
            OTP Verification
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            We have sent a 6-digit code to your email <span className="font-semibold text-[#1E293B]">{location.state.email}</span>
          </p>
        </div>

        {/* OTP Verification Form */}
        <form noValidate className="space-y-5" onSubmit={handleSubmit}>
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] space-y-6">

            {/* OTP Digit Input Boxes */}
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-3 text-center sm:text-left">
                Enter 6-digit verification code
              </label>

              <div className="flex items-center justify-between gap-2 sm:gap-3">
                {[0, 1, 2, 3, 4, 5].map((digitIndex) => (
                  <input
                    key={digitIndex}
                    type="text"
                    maxLength={1}
                    value={otp.otpCode[digitIndex]}
                    placeholder="•" name="otpCode" onChange={(e) => handleChange(e, digitIndex)}
                    className="w-11 h-12 sm:w-12 sm:h-13 text-center text-lg font-bold bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all duration-150"
                  />
                ))}
              </div>
            </div>

            {/* Resend Code Section */}
            <div className="text-center text-sm text-[#64748B]">
              Didn&apos;t receive the code?{' '}
              <button
                type="button"
                className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] hover:underline transition-colors cursor-pointer"
              >
                Resend OTP
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                className="w-full py-2.5 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-sm font-semibold rounded-xl shadow-xs hover:shadow transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#2563EB]/25"
              >
                Verify & Continue
              </button>
            </div>

          </div>

          {/* Back to Login Link */}
          <p className="text-center text-sm text-[#64748B]">
            <Link to="/login" className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] hover:underline transition-colors">
              Back to login
            </Link>
          </p>

        </form>
      </main>
    </div>
  )
}
