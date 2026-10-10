const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(\+92|0)3\d{9}$/;
const passwordRegex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const nameRegex  = /^[A-Za-z\s]{2,50}$/;

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

module.exports = {
    isValidEmail,
    isValidPhone,
    isValidPassword,
    isValidName,
     
   
}