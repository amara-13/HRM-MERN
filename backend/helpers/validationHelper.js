const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(\+92|0)3\d{9}$/;
const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const nameRegex  = /^[A-Za-z\s]{2,50}$/;
const GENDERS = ["Female", "Male", "Other"];
const employmentTypes = ["Full-time", "Part-time", "Contract", "Intern", "Temporary"];
const employmentStatus = ["Active", "Probation", "Confirmed", "Notice Period", "Resigned", "Terminated"];
const workLocations = ["Head Office - Karachi","Branch - Lahore","Remote",];
const grades = ["Junior", "Mid-Level", "Senior", "Manager"];
const payCycle = ["Monthly", "Bi-Weekly", "Weekly"];

const isValidEmail = (email)=>{
    return emailRegex.test(email);
}

const isValidPhone = (phone)=>{
    return phoneRegex.test(phone);
}

const isValidPassword = (password)=>{
    return passwordRegex.test(password);
}

const  isValidName = (name)=>{
    return nameRegex.test(name);
}

const isValidGender = (val) => {
    return GENDERS.includes(val);
}
const isValidEmploymentType = (type) => {
    return employmentTypes .includes(type);
}

const isValidEmploymentStatus = (status) => {
    return employmentStatus.includes(status);
};

const isValidWorkLocation = (location) => {
    return workLocations.includes(location);
};

const isValidGrade = (grade) => {
    return grades.includes(grade);
};
const isValidPayCycle = (pay)=>{
    return payCycle .includes(payCycle);
}

module.exports = {
    isValidEmail,
    isValidPhone,
    isValidPassword,
    isValidName,
    isValidGender,
    isValidEmploymentType,
    isValidEmploymentStatus,
    isValidWorkLocation,
    isValidGrade,
    isValidPayCycle,
};
