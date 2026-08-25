const express = require('express');
const router = express.Router();
const {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  submitDocument,
  approveDocument,
  revisionDocument,
  getDocumentHistory,
  deleteDocument,
  restoreDocument, // 1. Tambahkan import restoreDocument di sini
} = require('../controllers/documentController');
const authMiddleware = require('../middleware/authMiddleware');

// Middleware untuk menangani upload file (Multer)
// Pastikan file uploadMiddleware.js Anda ada di folder src/middleware/
const upload = require('../middleware/uploadMiddleware'); 

// Terapkan authMiddleware ke semua rute di bawahnya
router.use(authMiddleware);

router.get('/', getDocuments);
router.get('/history-all', getDocumentHistory);
router.get('/:id', getDocumentById);

// Menggunakan upload.single('file') agar req.body (seperti documentNumber & title) dan file terbaca
router.post('/', upload.single('file'), createDocument);
router.put('/:id', upload.single('file'), updateDocument);

router.post('/:id/submit', submitDocument);
router.post('/:id/approve', approveDocument);
router.post('/:id/revision', revisionDocument);

// 2. Rute DELETE untuk soft delete (memindahkan dokumen ke tempat sampah)
router.delete('/:id', deleteDocument);

// 3. Rute PUT untuk memulihkan dokumen jika batal dihapus
router.put('/:id/restore', restoreDocument);

module.exports = router;