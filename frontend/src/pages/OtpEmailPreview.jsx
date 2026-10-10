export default function OtpEmailPreview() {
  const otpCode = "582914"

  return (
    <div className="min-h-screen bg-[#F1F5F9] py-10 px-4 flex flex-col items-center">
      <div className="mb-4 text-center">
        <span className="bg-[#2563EB]/10 text-[#2563EB] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          Email Template Preview
        </span>
        <h2 className="text-xl font-bold text-[#0F172A] mt-2">
          OTP Email Notification
        </h2>
      </div>

      {/* Email Container Window Mockup */}
      <div className="w-full max-w-[560px] bg-white rounded-2xl border border-[#E2E8F0] shadow-lg overflow-hidden">
        {/* Email Header Metadata */}
        <div className="bg-[#0A1329] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#2563EB] flex items-center justify-center font-bold text-white text-lg">
              P
            </div>
            <div>
              <h3 className="font-semibold text-white tracking-tight text-base leading-tight">
                PeopleHub <span className="text-[#60A5FA] font-medium text-sm">HRM</span>
              </h3>
              <p className="text-xs text-slate-400">
                Subject: Your Verification Code: {otpCode} - PeopleHub HRM
              </p>
            </div>
          </div>
        </div>

        {/* Email Content Body */}
        <div className="p-8 bg-white">
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight mb-2">
            Verification Code
          </h1>

          <p className="text-sm text-[#64748B] leading-relaxed mb-6">
            Hello <strong className="text-[#0F172A]">Ayesha Khan</strong>,<br />
            Use the One-Time Password (OTP) below to complete your verification on <strong className="text-[#0F172A]">PeopleHub HRM</strong>.
          </p>

          {/* OTP Box */}
          <div className="bg-[#F8FAFC] border-2 border-dashed border-[#CBD5E1] rounded-2xl p-6 text-center my-6">
            <span className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
              Your OTP Code
            </span>
            <div className="text-4xl font-extrabold text-[#2563EB] tracking-[12px] pl-[12px] font-mono">
              {otpCode}
            </div>
          </div>

          {/* Warning Notice */}
          <div className="bg-[#FFFBEB] border-l-4 border-[#F59E0B] rounded-r-xl p-4 text-xs text-[#92400E] leading-relaxed mb-6">
            ⏱️ This OTP is valid for <strong>10 minutes</strong>. For security reasons, please do not share this code with anyone.
          </div>

          <p className="text-xs text-[#64748B]">
            If you did not request this verification code, please ignore this email or contact support.
          </p>
        </div>

        {/* Email Footer */}
        <div className="bg-[#F8FAFC] border-t border-[#F1F5F9] px-6 py-4 text-center text-xs text-[#94A3B8]">
          &copy; {new Date().getFullYear()} PeopleHub HRM System. All rights reserved.
        </div>
      </div>
    </div>
  )
}
