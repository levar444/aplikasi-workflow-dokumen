const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Ambil semua komentar berdasarkan documentId
const getCommentsByDocument = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const comments = await prisma.comment.findMany({
      where: { documentId },
      include: {
        user: {
          select: { email: true, role: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};

// Simpan komentar baru
const createComment = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const { message } = req.body;

    let userId = req.user?.id;
    if (!userId) {
      const defaultUser = await prisma.user.findFirst();
      userId = defaultUser ? defaultUser.id : 'e7bdb646-40f5-418c-94aa-f185fd573022';
    }

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Komentar tidak boleh kosong.' });
    }

    const newComment = await prisma.comment.create({
      data: {
        documentId,
        userId,
        message
      },
      include: {
        user: { select: { email: true, role: true } }
      }
    });

    res.status(201).json({ success: true, data: newComment });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCommentsByDocument,
  createComment
};