import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../../Services/authServices";
export default function Registration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:name === "phone" ? value.replace(/\s/g, ""):value,
    })
    )
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerApi(formData);
      if (response) {
        console.log(response);
        clearForm();
        Swal.fire({
          title: "Success",
          text: response.message || "User Register Successfully",
          icon: "success"
        });
        navigate("/otp", {
          state: {
            email: response.data.email,purpose: "register"

          }
        });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to Register User";
      Swal.fire({
        title: "Failed",
        text: errorMsg,
        icon: "error"
      });
    }
  }
  const clearForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
    });

  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-[#0A1329] border-b border-[#1E293B]/50 sticky top-0 z-50">
        <div className="max-w-[540px] mx-auto px-4 py-3.5 flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-[#2563EB] flex items-center justify-center font-bold text-white shadow-xs">
            P
          </div>
          <span className="font-semibold text-white tracking-tight text-base">
            PeopleHub <span className="text-[#60A5FA] font-medium text-sm ml-0.5">HRM</span>
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[540px] mx-auto px-4 py-10">
        {/* Title & Subtitle */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
            User Registration
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Create a new account by filling in your details below.
          </p>
        </div>

        {/* Simple Registration Form */}
        <form noValidate className="space-y-5" onSubmit={handleSubmit}>
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] space-y-4">

            {/* User Name */}
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-1.5" htmlFor="username">
                User name *
              </label>
              <input
                id="username"
                type="text"
                placeholder="Ayesha Khan"
                name="name" value={formData.name} onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all duration-150"
              />
              <p className="mt-1.5 text-xs text-[#64748B]">
                Use letters and spaces only.
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-1.5" htmlFor="email">
                Email *
              </label>
              <input
                id="email"
                type="email"
                placeholder="ayesha@company.com"
                name="email" value={formData.email} onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all duration-150"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-1.5" htmlFor="password">
                Password *
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                name="password" value={formData.password} onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all duration-150"
              />
              <p className="mt-1.5 text-xs text-[#64748B]">
                8+ characters with uppercase, lowercase, number & symbol.
              </p>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-1.5" htmlFor="mobile">
                Mobile number *
              </label>
              <input
                id="mobile"
                type="tel"
                placeholder="+923001234567"
                name="phone" value={formData.phone} onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all duration-150"
              />
              <p className="mt-1.5 text-xs text-[#64748B]">
                Use a valid phone number, e.g. +923001234567.
              </p>
            </div>

          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="reset" onClick={clearForm}
              className="px-5 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-sm font-semibold text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0F172A] active:bg-[#F1F5F9] transition-all cursor-pointer shadow-2xs"
            >
              Clear
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-sm font-semibold rounded-xl shadow-xs hover:shadow transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#2563EB]/25"
            >
              Register
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
