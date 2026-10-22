import { Link} from "react-router-dom";
function Home(){
  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-canvas border border-muted rounded-2xl p-8 sm:p-10 shadow-[0_4px_20px_-4px_rgba(113,63,50,0.06)] text-center">
        <div className="mx-auto mb-5 h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-3xl font-bold text-white shadow-md shadow-primary/20">
          P
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
          PeopleHub <span className="text-primary">HRM</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-ink/70 leading-relaxed">
          Streamlined Human Resource Management for Modern Teams
        </p>
        <div className="mt-8 space-y-3.5">

          <Link
            type="button"  to = "/login"  className="w-full py-3 block px-6 bg-primary hover:bg-primary-dk text-white text-sm font-semibold rounded-xl shadow-xs hover:shadow transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/25"
          >
            Sign in to Account
          </Link>

          <Link
            type="button" to = "/register"
            
            className="w-full py-3 px-6 bg-canvas border block border-muted text-ink hover:bg-surface text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            Create New Account
          </Link>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-xs text-ink/60">
          &copy; {new Date().getFullYear()} PeopleHub HRM. All rights reserved.
        </p>
      </div>
    </div>
  )
}
export default Home;