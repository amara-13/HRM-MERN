import { useState } from "react";
import {Link,useLocation,useNavigate} from "react-router-dom"
import {loginApi} from "../../Services/authServices";
import Swal from "sweetalert2";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [formData,setFormData] = useState({
    email:email,
    password:"",
    rememberMe:false,
  });

  const handleChange = (e)=>{
    const{name,value,type,checked} = e.target;
    setFormData((prev)=>({
      ...prev,
      [name]: type==="checkbox"?checked : value,
    }));
  };
  const handleSubmit = async(e)=>{
    try{

    e.preventDefault();
    const response = await loginApi(formData);
    if(response){
     navigate("/dashboard")
    }
  }catch(error){
    console.log("actual Error",error.message||error);
    const errorMsg = error.response?.data?.message || "Failed to login";
    Swal.fire({
      title:"Failed",
      text:errorMsg,
      icon:"error"
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
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-ink/70">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <form noValidate className="space-y-5" onSubmit={handleSubmit}>
          <div className="bg-canvas border border-muted rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(113,63,50,0.06)] space-y-4">
            
            {/* Email / Username */}
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5" htmlFor="email">
                Email address *
              </label>
              <input
                id="email"
                type="email"
                placeholder="ayesha@company.com" name="email" value = {formData.email} onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-canvas border border-muted rounded-xl text-ink placeholder:text-ink/40 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all duration-150"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-ink" htmlFor="password">
                  Password *
                </label>
                <Link to ="/forgot" className="text-xs font-semibold text-primary hover:text-primary-dk hover:underline transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                name = "password" value = {formData.password} onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-canvas border border-muted rounded-xl text-ink placeholder:text-ink/40 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all duration-150"
              />
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="remember"
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe} onChange={handleChange}
                className="h-4 w-4 rounded border-muted text-primary focus:ring-primary/25 accent-primary cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm font-medium text-ink/70 cursor-pointer select-none">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-6 bg-primary hover:bg-primary-dk text-white text-sm font-semibold rounded-xl shadow-xs hover:shadow transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/25"
              >
                Sign in
              </button>
            </div>

          </div>

          {/* Footer Link */}
          <p className="text-center text-sm text-ink/70">
            Don&apos;t have an account?{' '}
            <Link  to = "/register" className="font-semibold text-primary hover:text-primary-dk hover:underline transition-colors">
              Register here
            </Link>
          </p>

        </form>
      </main>
    </div>
  )
}
