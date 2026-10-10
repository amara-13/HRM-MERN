import { useState } from 'react'
import '../../styles/auth.css'

function Registration() {
  const initialFormState = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    employeeId: '',
    designation: '',
    department: '',
    employmentType: 'Full-time',
    joiningDate: '',
    reportingManager: '',
    streetAddress: '',
    city: '',
    country: ''
  }

  const [formData, setFormData] = useState(initialFormState)
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' })

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
    if (statusMessage.text) setStatusMessage({ type: '', text: '' })
  }

  const handleClear = () => {
    setFormData(initialFormState)
    setStatusMessage({ type: '', text: '' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Check required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'employeeId', 'designation', 'department', 'joiningDate']
    const emptyFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === '')
    
    if (emptyFields.length > 0) {
      setStatusMessage({
        type: 'error',
        text: 'Please fill in all required fields (marked *) with valid values.'
      })
      return
    }

    setStatusMessage({
      type: 'success',
      text: 'Employee registered successfully!'
    })
  }

  const inputClasses = "w-full px-3.5 py-2.5 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all duration-150"
  const selectClasses = "w-full px-3.5 py-2.5 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all duration-150 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%3D%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:18px_18px] bg-[right_12px_center] bg-no-repeat pr-10 cursor-pointer"
  const labelClasses = "block text-sm font-semibold text-[#1E293B] mb-1.5"

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-[#0A1329] border-b border-[#1E293B]/50 sticky top-0 z-50">
        <div className="max-w-[820px] mx-auto px-4 py-3.5 flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-[#2563EB] flex items-center justify-center font-bold text-white shadow-xs">
            P
          </div>
          <span className="font-semibold text-white tracking-tight text-base">
            PeopleHub <span className="text-[#60A5FA] font-medium text-sm ml-0.5">HRM</span>
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[820px] mx-auto px-4 py-8 sm:py-10">
        {/* Title & Subtitle */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-[26px] font-bold text-[#0F172A] tracking-tight">
            Employee Registration
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Fill in the details below to add a new employee.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-6">

          {/* Section 1: Personal information */}
          <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
            <h2 className="text-[17px] font-bold text-[#0F172A] mb-5 tracking-tight">
              Personal information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
              <div>
                <label className={labelClasses} htmlFor="firstName">
                  First name *
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Ayesha"
                />
              </div>

              <div>
                <label className={labelClasses} htmlFor="lastName">
                  Last name *
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Khan"
                />
              </div>

              <div>
                <label className={labelClasses} htmlFor="email">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="ayesha@company.com"
                />
              </div>

              <div>
                <label className={labelClasses} htmlFor="phone">
                  Phone *
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="+92 300 1234567"
                />
              </div>

              <div>
                <label className={labelClasses} htmlFor="dob">
                  Date of birth
                </label>
                <input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses} htmlFor="gender">
                  Gender
                </label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={selectClasses}
                >
                  <option value="">Select</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 2: Job details */}
          <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
            <h2 className="text-[17px] font-bold text-[#0F172A] mb-5 tracking-tight">
              Job details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
              <div>
                <label className={labelClasses} htmlFor="employeeId">
                  Employee ID *
                </label>
                <input
                  id="employeeId"
                  type="text"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="EMP-0001"
                />
              </div>

              <div>
                <label className={labelClasses} htmlFor="designation">
                  Designation *
                </label>
                <input
                  id="designation"
                  type="text"
                  value={formData.designation}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Software Engineer"
                />
              </div>

              <div>
                <label className={labelClasses} htmlFor="department">
                  Department *
                </label>
                <select
                  id="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={selectClasses}
                >
                  <option value="">Select</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Finance">Finance</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>

              <div>
                <label className={labelClasses} htmlFor="employmentType">
                  Employment type
                </label>
                <select
                  id="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className={selectClasses}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>

              <div>
                <label className={labelClasses} htmlFor="joiningDate">
                  Joining date *
                </label>
                <input
                  id="joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses} htmlFor="reportingManager">
                  Reporting manager
                </label>
                <input
                  id="reportingManager"
                  type="text"
                  value={formData.reportingManager}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Manager name"
                />
              </div>
            </div>
          </section>

          {/* Section 3: Address */}
          <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
            <h2 className="text-[17px] font-bold text-[#0F172A] mb-5 tracking-tight">
              Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
              <div className="sm:col-span-2">
                <label className={labelClasses} htmlFor="streetAddress">
                  Street address
                </label>
                <input
                  id="streetAddress"
                  type="text"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="House, street, area"
                />
              </div>

              <div>
                <label className={labelClasses} htmlFor="city">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Lahore"
                />
              </div>

              <div>
                <label className={labelClasses} htmlFor="country">
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  value={formData.country}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Pakistan"
                />
              </div>
            </div>
          </section>

          {/* Status Message Notification */}
          {statusMessage.text && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                statusMessage.type === 'error'
                  ? 'border-red-200 bg-red-50 text-red-700'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700'
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="px-5 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-sm font-semibold text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0F172A] active:bg-[#F1F5F9] transition-all cursor-pointer shadow-2xs"
            >
              Clear
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-sm font-semibold rounded-xl shadow-xs hover:shadow transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#2563EB]/25"
            >
              Register employee
            </button>
          </div>

        </form>
      </main>
    </div>
  )
}

export default Registration