const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', authMiddleware, upload.single('file'), uploadFile);

module.exports = router;