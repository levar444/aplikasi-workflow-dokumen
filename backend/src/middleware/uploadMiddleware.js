const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|xls|xlsx|jpg|jpeg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  // Hanya validasi berdasarkan ekstensi file agar lebih andal saat diunggah dari browser
  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('Hanya file PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG yang diizinkan!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 50 * 1024 * 1024 // Diubah menjadi 50 MB (Anda bisa mengganti angka 50 ini sesuai keinginan)
  }
});

module.exports = upload;