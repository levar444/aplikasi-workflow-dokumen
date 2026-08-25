const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createNotification } = require('./notificationService');

const logWorkflow = async (documentId, userId, previousStatus, newStatus, note = null) => {
  await prisma.workflowHistory.create({
    data: {
      documentId,
      userId,
      previousStatus,
      newStatus,
      note,
    },
  });
};

const notifyTargetRole = async (newStatus, documentNumber) => {
  let targetRole = '';
  if (newStatus === 'SUBMITTED_TO_USER3') targetRole = 'USER3';
  else if (newStatus === 'SUBMITTED_TO_USER2' || newStatus === 'REVISION_USER3') targetRole = 'USER3';
  else if (newStatus === 'SUBMITTED_TO_USER1' || newStatus === 'REVISION_USER2') targetRole = 'USER2';
  else if (newStatus === 'REVISION_USER4') targetRole = 'USER4';

  if (!targetRole && newStatus === 'APPROVED') return;

  // Jika revisi untuk user tertentu
  if (newStatus === 'REVISION_USER3') targetRole = 'USER3';
  if (newStatus === 'REVISION_USER2') targetRole = 'USER2';
  if (newStatus === 'REVISION_USER4') targetRole = 'USER4';

  // Perbaikan: Menghapus properti 'isActive: true' yang menyebabkan error validasi Prisma
  const users = await prisma.user.findMany({ where: { role: targetRole } });
  for (const u of users) {
    await createNotification(u.id, `Dokumen ${documentNumber} memerlukan tindakan Anda (Status: ${newStatus}).`);
  }
};

module.exports = { logWorkflow, notifyTargetRole };