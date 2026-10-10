import { Link} from "react-router-dom";
function Home(){
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl p-8 sm:p-10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] text-center">
        <div className="mx-auto mb-5 h-16 w-16 rounded-2xl bg-[#2563EB] flex items-center justify-center text-3xl font-bold text-white shadow-md shadow-blue-500/20">
          P
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
          PeopleHub <span className="text-[#2563EB]">HRM</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#64748B] leading-relaxed">
          Streamlined Human Resource Management for Modern Teams
        </p>
        <div className="mt-8 space-y-3.5">

          <Link
            type="button"  to = "/login"  className="w-full py-3  block px-6 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-sm font-semibold rounded-xl shadow-xs hover:shadow transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#2563EB]/25"
          >
            Sign in to Account
          </Link>

          <Link
            type="button" to = "/register"
            
            className="w-full py-3 px-6 bg-white border block border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0F172A] active:bg-[#F1F5F9] text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            Create New Account
          </Link>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-xs text-[#94A3B8]">
          &copy; {new Date().getFullYear()} PeopleHub HRM. All rights reserved.
        </p>
      </div>
    </div>
  )
}
export default Home;