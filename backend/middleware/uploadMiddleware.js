const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(process.cwd(),"private-uploads","employee-documents");
fs.mkdirSync(uploadDir,{recursive:true});

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,uploadDir);
    },
    filename:(req,file,cb)=>{
        const uniqueName = `${Date.now()}-${require("crypto").randomUUID()}` +
        path.extname(file.originalname).toLowerCase();
        cb(null,uniqueName);
    },
});

const allowedMimeTypes = new Set([
"application/pdf",
"image/jpeg",
"image/png",
]);
const fileFilter = (req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
        const error = new Error("Only PDF, JPEG, and PNG files are allowed");
        error.status = 400;
        return cb(error, false);
    }
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.FILESIZELIMIT, 10) || 5 * 1024 * 1024,
        files: 1,
    },
});
module.exports = upload;