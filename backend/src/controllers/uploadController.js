const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const uploadFile = async (req, res, next) => {
  try {
    const { documentId } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: 'Tidak ada file yang diunggah.' });

    const fileUpload = await prisma.fileUpload.create({
      data: {
        documentId: documentId || null,
        fileName: file.filename,
        originalName: file.originalname,
        filePath: file.path,
        mimeType: file.mimetype,
        size: file.size,
      },
    });

    res.status(201).json({ success: true, data: fileUpload });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadFile };