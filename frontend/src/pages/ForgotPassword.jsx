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
            Forgot Password?
          </h1>
          <p className="mt-1 text-sm text-ink/70">
            Enter your registered email address and we will send you an OTP to reset your password.
          </p>
        </div>

        {/* Forgot Password Form */}
        <form noValidate className="space-y-5" onSubmit={handleSubmit}>
          <div className="bg-canvas border border-muted rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(113,63,50,0.06)] space-y-4">

            {/* Email Address */}
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5" htmlFor="email">
                Email address *
              </label>
              <input
                id="email"
                type="email"
                name="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="ayesha@company.com"
                className="w-full px-3.5 py-2.5 text-sm bg-canvas border border-muted rounded-xl text-ink placeholder:text-ink/40 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all duration-150"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-6 bg-primary hover:bg-primary-dk text-white text-sm font-semibold rounded-xl shadow-xs hover:shadow transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/25"
              >
                Send OTP
              </button>
            </div>

          </div>

          {/* Back to Login Link */}
          <p className="text-center text-sm text-ink/70">
            Remembered your password?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-primary-dk hover:underline transition-colors">
              Back to login
            </Link>
          </p>

        </form>
      </main>
    </div>
  )
}
