const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createNotification = async (userId, message) => {
  try {
    await prisma.notification.create({
      data: {
        userId,
        message,
      },
    });
  } catch (error) {
    console.error('Gagal membuat notifikasi:', error);
  }
};

module.exports = { createNotification };