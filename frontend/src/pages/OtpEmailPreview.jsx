export default function OtpEmailPreview() {
  const otpCode = "582914"

  return (
    <div className="min-h-screen bg-surface py-10 px-4 flex flex-col items-center">
      <div className="mb-4 text-center">
        <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          Email Template Preview
        </span>
        <h2 className="text-xl font-bold text-ink mt-2">
          OTP Email Notification
        </h2>
      </div>

      {/* Email Container Window Mockup */}
      <div className="w-full max-w-[560px] bg-canvas rounded-2xl border border-muted shadow-[0_4px_20px_-4px_rgba(113,63,50,0.06)] overflow-hidden">
        {/* Email Header Metadata */}
        <div className="bg-primary-dk px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center font-bold text-white text-lg">
              P
            </div>
            <div>
              <h3 className="font-semibold text-white tracking-tight text-base leading-tight">
                PeopleHub <span className="text-muted font-medium text-sm">HRM</span>
              </h3>
              <p className="text-xs text-slate-400">
                Subject: Your Verification Code: {otpCode} - PeopleHub HRM
              </p>
            </div>
          </div>
        </div>

        {/* Email Content Body */}
        <div className="p-8 bg-canvas">
          <h1 className="text-2xl font-bold text-ink tracking-tight mb-2">
            Verification Code
          </h1>

          <p className="text-sm text-ink/70 leading-relaxed mb-6">
            Hello <strong className="text-ink">Ayesha Khan</strong>,<br />
            Use the One-Time Password (OTP) below to complete your verification on <strong className="text-ink">PeopleHub HRM</strong>.
          </p>

          {/* OTP Box */}
          <div className="bg-surface border-2 border-dashed border-muted rounded-2xl p-6 text-center my-6">
            <span className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-2">
              Your OTP Code
            </span>
            <div className="text-4xl font-extrabold text-primary tracking-[12px] pl-[12px] font-mono">
              {otpCode}
            </div>
          </div>

          {/* Warning Notice */}
          <div className="bg-[#FFFBEB] border-l-4 border-[#F59E0B] rounded-r-xl p-4 text-xs text-[#92400E] leading-relaxed mb-6">
            ⏱️ This OTP is valid for <strong>10 minutes</strong>. For security reasons, please do not share this code with anyone.
          </div>

          <p className="text-xs text-ink/70">
            If you did not request this verification code, please ignore this email or contact support.
          </p>
        </div>

        {/* Email Footer */}
        <div className="bg-surface border-t border-muted px-6 py-4 text-center text-xs text-ink/60">
          &copy; {new Date().getFullYear()} PeopleHub HRM System. All rights reserved.
        </div>
      </div>
    </div>
  )
}
