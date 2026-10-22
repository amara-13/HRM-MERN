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
            OTP Verification
          </h1>
          <p className="mt-1 text-sm text-ink/70">
            We have sent a 6-digit code to your email <span className="font-semibold text-ink">{location.state.email}</span>
          </p>
        </div>

        {/* OTP Verification Form */}
        <form noValidate className="space-y-5" onSubmit={handleSubmit}>
          <div className="bg-canvas border border-muted rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(113,63,50,0.06)] space-y-6">

            {/* OTP Digit Input Boxes */}
            <div>
              <label className="block text-sm font-semibold text-ink mb-3 text-center sm:text-left">
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
                    className="w-11 h-12 sm:w-12 sm:h-13 text-center text-lg font-bold bg-canvas border border-muted rounded-xl text-ink placeholder:text-ink/40 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all duration-150"
                  />
                ))}
              </div>
            </div>

            {/* Resend Code Section */}
            <div className="text-center text-sm text-ink/70">
              Didn&apos;t receive the code?{' '}
              <button
                type="button"
                className="font-semibold text-primary hover:text-primary-dk hover:underline transition-colors cursor-pointer"
              >
                Resend OTP
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                className="w-full py-2.5 px-6 bg-primary hover:bg-primary-dk text-white text-sm font-semibold rounded-xl shadow-xs hover:shadow transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/25"
              >
                Verify & Continue
              </button>
            </div>

          </div>

          {/* Back to Login Link */}
          <p className="text-center text-sm text-ink/70">
            <Link to="/login" className="font-semibold text-primary hover:text-primary-dk hover:underline transition-colors">
              Back to login
            </Link>
          </p>

        </form>
      </main>
    </div>
  )
}
