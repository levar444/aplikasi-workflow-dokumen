const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      // Ubah 'name' menjadi 'Name' sesuai database Railway
      select: { id: true, Name: true, email: true, role: true, createdAt: true },
    });
    // Mapping agar properti kembali menjadi 'name' untuk frontend
    const formattedUsers = users.map(user => ({
      ...user,
      name: user.Name
    }));
    res.json({ success: true, data: formattedUsers });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password || 'password123', 10);
    const user = await prisma.user.create({
      data: { Name: name, email, password: hashedPassword, role: role || 'USER4' },
    });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { Name: name, email, role },
    });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    res.status(400).json({ success: false, message: 'Fitur status tidak didukung pada skema database saat ini.' });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.json({ success: true, message: 'User berhasil dihapus.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, createUser, updateUser, updateStatus, deleteUser };