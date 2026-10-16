const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(\+92|0)3\d{9}$/;
const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const nameRegex  = /^[A-Za-z\s]{2,50}$/;
const GENDERS = ["Female", "Male", "Other"];
const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Intern", "Temporary"];
const EMPLOYMENT_STATUS = ["Active", "Probation", "Confirmed", "Notice Period", "Resigned", "Terminated"];


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
    return EMPLOYMENT_TYPES.includes(type);
}

const isValidEmploymentStatus = (status) => {
    return EMPLOYMENT_STATUS.includes(status);
};

module.exports = {
    isValidEmail,
    isValidPhone,
    isValidPassword,
    isValidName,
    isValidGender,
    isValidEmploymentType,
    isValidEmploymentStatus,
}