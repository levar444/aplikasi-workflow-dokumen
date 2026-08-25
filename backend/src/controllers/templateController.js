const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getTemplates = async (req, res, next) => {
  try {
    const templates = await prisma.template.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: templates });
  } catch (error) {
    next(error);
  }
};

const createTemplate = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const file = req.file;
    const template = await prisma.template.create({
      data: {
        name,
        description,
        fileName: file ? file.filename : '',
        filePath: file ? file.path : '',
      },
    });
    res.status(201).json({ success: true, data: template });
  } catch (error) {
    next(error);
  }
};

const updateTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const template = await prisma.template.update({
      where: { id },
      data: { name, description },
    });
    res.json({ success: true, data: template });
  } catch (error) {
    next(error);
  }
};

const deleteTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.template.delete({ where: { id } });
    res.json({ success: true, message: 'Template berhasil dihapus.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTemplates, createTemplate, updateTemplate, deleteTemplate };