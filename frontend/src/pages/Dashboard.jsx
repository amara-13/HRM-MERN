export default function Dashboard() {
  const user = {
    name: "Ayesha Khan",
    role: "Software Engineer",
    department: "Engineering",
    employeeId: "EMP-0042",
    avatar: "AK",
    joinDate: "Jan 15, 2024",
  }

  const stats = [
    { label: "Days Present",    value: "22",  sub: "This month",    icon: "✅", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
    { label: "Leaves Taken",    value: "3",   sub: "This month",    icon: "🏖️", color: "bg-amber-50  border-amber-200  text-amber-700"   },
    { label: "Pending Tasks",   value: "7",   sub: "Due this week",  icon: "📋", color: "bg-blue-50   border-blue-200   text-blue-700"    },
    { label: "Announcements",   value: "2",   sub: "Unread",        icon: "📢", color: "bg-purple-50 border-purple-200 text-purple-700"  },
  ]

  const recentActivity = [
    { action: "Clock In",          time: "Today, 9:02 AM",    status: "success" },
    { action: "Leave Approved",    time: "Yesterday",         status: "success" },
    { action: "Task Assigned",     time: "Oct 1, 2026",       status: "info"    },
    { action: "Payslip Generated", time: "Sep 30, 2026",      status: "info"    },
    { action: "Clock Out",         time: "Sep 30, 5:32 PM",   status: "neutral" },
  ]

  const quickLinks = [
    { label: "Apply Leave",     icon: "🏖️",  href: "#" },
    { label: "View Payslip",    icon: "💰",  href: "#" },
    { label: "My Attendance",   icon: "📅",  href: "#" },
    { label: "My Tasks",        icon: "📋",  href: "#" },
    { label: "Team Directory",  icon: "👥",  href: "#" },
    { label: "Help & Support",  icon: "💬",  href: "#" },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ── Top Navigation Bar ── */}
      <header className="bg-[#0A1329] border-b border-[#1E293B]/60 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-[#2563EB] flex items-center justify-center font-bold text-white text-sm shadow-md shadow-blue-500/30">
              P
            </div>
            <span className="font-semibold text-white tracking-tight text-base">
              PeopleHub <span className="text-[#60A5FA] font-medium text-sm">HRM</span>
            </span>
          </div>

          {/* Right — avatar + name */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
              <p className="text-[11px] text-slate-400">{user.role}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-[#2563EB] flex items-center justify-center font-bold text-white text-sm ring-2 ring-white/10">
              {user.avatar}
            </div>
          </div>
        </div>
      </header>

      {/* ── Page Body ── */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 space-y-7">

        {/* ── Welcome Banner ── */}
        <div className="bg-gradient-to-r from-[#1D4ED8] to-[#2563EB] rounded-2xl px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-md shadow-blue-500/20">
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">Welcome back 👋</p>
            <h1 className="text-2xl font-bold text-white tracking-tight">{user.name}</h1>
            <p className="text-blue-100 text-sm mt-0.5">{user.role} · {user.department} · {user.employeeId}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-center min-w-[120px]">
              <p className="text-blue-100 text-xs font-medium">Joined</p>
              <p className="text-white font-semibold text-sm mt-0.5">{user.joinDate}</p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-center min-w-[120px]">
              <p className="text-blue-100 text-xs font-medium">Today</p>
              <p className="text-white font-semibold text-sm mt-0.5">
                {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`bg-white border rounded-2xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-col gap-2 ${stat.color.split(" ")[1]}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{stat.icon}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${stat.color}`}>
                  {stat.sub}
                </span>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-[#0F172A] tracking-tight">{stat.value}</p>
                <p className="text-sm text-[#64748B] font-medium mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Quick Links + Recent Activity ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Quick Links */}
          <div className="lg:col-span-1 bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
            <h2 className="text-base font-bold text-[#0F172A] mb-4 tracking-tight">Quick Links</h2>
            <div className="grid grid-cols-2 gap-2.5">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#EFF6FF] hover:border-[#BFDBFE] transition-all duration-150 text-center group"
                >
                  <span className="text-2xl">{link.icon}</span>
                  <span className="text-xs font-semibold text-[#334155] group-hover:text-[#1D4ED8] transition-colors leading-tight">
                    {link.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
            <h2 className="text-base font-bold text-[#0F172A] mb-4 tracking-tight">Recent Activity</h2>
            <div className="space-y-2.5">
              {recentActivity.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9]"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-2 w-2 rounded-full flex-shrink-0 ${
                        item.status === "success"
                          ? "bg-emerald-500"
                          : item.status === "info"
                          ? "bg-blue-500"
                          : "bg-slate-400"
                      }`}
                    />
                    <span className="text-sm font-semibold text-[#1E293B]">{item.action}</span>
                  </div>
                  <span className="text-xs text-[#94A3B8] font-medium">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Profile Summary Card ── */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <h2 className="text-base font-bold text-[#0F172A] mb-5 tracking-tight">My Profile</h2>
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            {/* Avatar */}
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-2xl font-extrabold text-white shadow-md shadow-blue-500/20 flex-shrink-0">
              {user.avatar}
            </div>
            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-4 flex-1">
              {[
                { label: "Full Name",    value: user.name },
                { label: "Employee ID",  value: user.employeeId },
                { label: "Department",   value: user.department },
                { label: "Designation",  value: user.role },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wide mb-0.5">
                    {item.label}
                  </p>
                  <p className="text-sm font-bold text-[#1E293B]">{item.value}</p>
                </div>
              ))}
            </div>
            {/* Edit Button */}
            <button className="ml-auto px-4 py-2 text-sm font-semibold text-[#2563EB] border border-[#BFDBFE] bg-[#EFF6FF] rounded-xl hover:bg-[#DBEAFE] transition-all cursor-pointer">
              Edit Profile
            </button>
          </div>
        </div>

      </main>
    </div>
  )
}
