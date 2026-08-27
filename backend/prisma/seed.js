const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  await prisma.notification.deleteMany();
  await prisma.revision.deleteMany();
  await prisma.workflowHistory.deleteMany();
  await prisma.fileUpload.deleteMany();
  await prisma.documentData.deleteMany();
  await prisma.document.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.user.createMany({
    data: [
      { name: 'Final Approver', email: 'user1@example.com', password: hashedPassword, role: 'USER1', isActive: true },
      { name: 'Validator User', email: 'user2@example.com', password: hashedPassword, role: 'USER2', isActive: true },
      { name: 'Template User', email: 'user3@example.com', password: hashedPassword, role: 'USER3', isActive: true },
      { name: 'Input User', email: 'user4@example.com', password: hashedPassword, role: 'USER4', isActive: true },
    ],
  });

  console.log('Seeding database berhasil: 4 user dibuat.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });