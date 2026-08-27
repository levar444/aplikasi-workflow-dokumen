const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { logWorkflow, notifyTargetRole } = require('../services/workflowService');


// =====================================================
// GET ALL DOCUMENTS
// =====================================================
const getDocuments = async (req, res, next) => {
  try {
    const { search, status, documentType, trash } = req.query;

    let where = {};

    if (trash === 'true') {
      where.isDeleted = true;
    } else {
      where.isDeleted = false;
    }

    if (search) {
      where.OR = [
        { documentNumber: { contains: search } },
        { documentData: { fullName: { contains: search } } }
      ];
    }

    if (status) {
      where.status = status;
    }

    if (documentType) {
      where.documentData = {
        documentType
      };
    }

    const documents = await prisma.document.findMany({
      where,
      include: {
        documentData: true,
        uploader: {
          select: {
            email: true,
            role: true
          }
        },
        fileUpload: true,
        workflowHistories: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: documents
    });

  } catch (error) {
    next(error);
  }
};


// =====================================================
// GET DOCUMENT BY ID
// =====================================================
const getDocumentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        documentData: true,
        fileUpload: true,
        uploader: {
          select: {
            email: true,
            role: true
          }
        },
        workflowHistories: {
          include: {
            user: {
              select: {
                email: true,
                role: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        revisions: true
      }
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Dokumen tidak ditemukan.'
      });
    }

    res.json({
      success: true,
      data: document
    });

  } catch (error) {
    next(error);
  }
};


// =====================================================
// CREATE DOCUMENT
// =====================================================
const createDocument = async (req, res, next) => {
  try {
    let docNumber = req.body?.documentNumber ? String(req.body.documentNumber).trim() : '';

    if (!docNumber) {
      docNumber = 'DOC-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    } else {
      const existingDoc = await prisma.document.findUnique({
        where: { documentNumber: docNumber }
      });

      if (existingDoc) {
        return res.status(400).json({
          success: false,
          message: `Nomor dokumen '${docNumber}' sudah terdaftar.`
        });
      }
    }

    const docTitle = req.body && req.body.title ? String(req.body.title) : docNumber;

    let userId = req.user?.id;
    if (!userId) {
      const defaultUser = await prisma.user.findFirst();
      if (!defaultUser) {
        return res.status(400).json({
          success: false,
          message: 'Tidak ada data user di database.'
        });
      }
      userId = defaultUser.id;
    }

    // Menentukan status draft awal secara dinamis berdasarkan role user yang sedang login
    // Menentukan status draft awal secara dinamis berdasarkan role user yang sedang login
    let initialStatus = 'DRAFT_USER4';
    const userRole = req.user?.role;
    if (userRole === 'USER6') initialStatus = 'DRAFT_USER6'; // <-- TAMBAHKAN INI
    else if (userRole === 'USER5') initialStatus = 'DRAFT_USER5';
    else if (userRole === 'USER3') initialStatus = 'DRAFT_USER3';
    else if (userRole === 'USER2') initialStatus = 'DRAFT_USER2'; 

    const createData = {
      documentNumber: docNumber,
      status: initialStatus,
      uploadedBy: userId,
      documentData: {
        create: {
          fullName: docTitle,
          nik: req.body?.nik || '-',
          documentNumber: docNumber,
          date: req.body?.date || new Date().toISOString().split('T')[0],
          address: req.body?.address || '-',
          phone: req.body?.phone || '-',
          email: req.body?.email || req.user?.email || 'user@gmail.com',
          documentType: req.body?.documentType || 'GENERAL',
          description: docTitle
        }
      }
    };

    if (req.file) {
      createData.fileUpload = {
        create: {
          fileName: req.file.filename,
          originalName: req.file.originalname,
          filePath: req.file.path,
          mimeType: req.file.mimetype,
          size: req.file.size
        }
      };
    }

    const newDoc = await prisma.document.create({
      data: createData,
      include: {
        documentData: true,
        fileUpload: true
      }
    });

    await logWorkflow(newDoc.id, userId, 'CREATED', initialStatus, 'Membuat draft dokumen awal.');

    res.status(201).json({
      success: true,
      data: newDoc
    });

  } catch (error) {
    next(error);
  }
};


// =====================================================
// UPDATE DOCUMENT
// =====================================================
const updateDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const docNumber = req.body && req.body.documentNumber ? String(req.body.documentNumber) : 'DOC-' + Date.now();
    const docTitle = req.body && req.body.title ? String(req.body.title) : docNumber;

    const updated = await prisma.document.update({
      where: { id },
      data: {
        documentNumber: docNumber,
        documentData: {
          update: {
            fullName: docTitle,
            documentNumber: docNumber,
            description: docTitle
          }
        }
      },
      include: { documentData: true }
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};


// =====================================================
// SUBMIT DOCUMENT (Menyimpan comment)
// =====================================================
const submitDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { targetStatus: bodyTargetStatus, comment } = req.body;

    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Dokumen tidak ditemukan.' });
    }

    // Hanya memperbarui status dan komentar saja
    const updated = await prisma.document.update({
      where: { id },
      data: { 
        status: nextStatus,
        comment: comment && comment.trim() !== '' ? comment : doc.comment 
      }
    });
    
    let userId = req.user?.id;
    if (!userId) {
      const defaultUser = await prisma.user.findFirst();
      userId = defaultUser ? defaultUser.id : 'e7bdb646-40f5-418c-94aa-f185fd573022';
    }

    const logMessage = comment && comment.trim() !== '' 
      ? `Mengirim dokumen. Catatan: ${comment}` 
      : 'Mengirim dokumen ke tahap berikutnya.';

    await logWorkflow(id, userId, doc.status, nextStatus, logMessage);
    await notifyTargetRole(nextStatus, doc.documentNumber);

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};


// =====================================================
// APPROVE DOCUMENT (Menyimpan comment)
// =====================================================
const approveDocument = async (req, res, next) => {
  try {
    let userId = req.user?.id;
    if (!userId) {
      const defaultUser = await prisma.user.findFirst();
      userId = defaultUser ? defaultUser.id : 'e7bdb646-40f5-418c-94aa-f185fd573022';
    }

    const userRole = req.user?.role || 'USER1';
    if (userRole !== 'USER1') {
      return res.status(403).json({ success: false, message: 'Hanya User1 yang dapat melakukan approval.' });
    }

    const { id } = req.params;
    const { comment } = req.body; 

    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc) return res.status(404).json({ success: false, message: 'Dokumen tidak ditemukan.' });

    const updated = await prisma.document.update({
      where: { id },
      data: { 
        status: 'APPROVED',
        comment: comment && comment.trim() !== '' ? comment : doc.comment
      }
    });

    const logMessage = comment && comment.trim() !== '' 
      ? `Dokumen disetujui sepenuhnya. Catatan: ${comment}` 
      : 'Dokumen disetujui sepenuhnya.';

    await logWorkflow(id, userId, doc.status, 'APPROVED', logMessage);

    res.json({ success: true, message: 'Dokumen berhasil disetujui.', data: updated });
  } catch (error) {
    next(error);
  }
};


// =====================================================
// REVISION DOCUMENT
// =====================================================
const revisionDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason, comment } = req.body;
    const finalReason = reason || comment || '-';

    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc) return res.status(404).json({ success: false, message: 'Dokumen tidak ditemukan.' });

    let userId = req.user?.id;
    if (!userId) {
      const defaultUser = await prisma.user.findFirst();
      userId = defaultUser ? defaultUser.id : 'e7bdb646-40f5-418c-94aa-f185fd573022';
    }

    const userRole = req.user?.role || 'USER1';
    let targetStatus = '', targetUserRole = '';

    if (userRole === 'USER1') { targetStatus = 'REVISION_USER2'; targetUserRole = 'USER2'; }
    else if (userRole === 'USER2') { targetStatus = 'REVISION_USER3'; targetUserRole = 'USER3'; }
    else if (userRole === 'USER3') { targetStatus = 'REVISION_USER4'; targetUserRole = 'USER4'; }
    else if (userRole === 'USER4') { targetStatus = 'REVISION_USER5'; targetUserRole = 'USER5'; }

    const updated = await prisma.document.update({
      where: { id },
      data: { 
        status: targetStatus,
        comment: finalReason
      }
    });

    await prisma.revision.create({
      data: { documentId: id, requestedBy: userId, targetUser: targetUserRole, reason: finalReason }
    });

    await logWorkflow(id, userId, doc.status, targetStatus, `Meminta revisi: ${finalReason}`);
    await notifyTargetRole(targetStatus, doc.documentNumber);

    res.json({ success: true, message: 'Permintaan revisi dikirim.', data: updated });
  } catch (error) {
    next(error);
  }
};


// =====================================================
// GET DOCUMENT HISTORY
// =====================================================
const getDocumentHistory = async (req, res, next) => {
  try {
    const histories = await prisma.workflowHistory.findMany({
      include: {
        user: { select: { email: true, role: true } },
        document: { select: { documentNumber: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: histories });
  } catch (error) {
    next(error);
  }
};


// =====================================================
// ROLLBACK DOCUMENT (Menyimpan comment)
// =====================================================
const rollbackDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { targetUser, comment } = req.body;

    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc) return res.status(404).json({ success: false, message: 'Dokumen tidak ditemukan.' });

    let userId = req.user?.id;
    if (!userId) {
      const defaultUser = await prisma.user.findFirst();
      userId = defaultUser ? defaultUser.id : 'e7bdb646-40f5-418c-94aa-f185fd573022';
    }

    let targetStatus = '', message = '';
    if (targetUser === 'USER2') { targetStatus = 'DRAFT_USER2'; message = 'Dikembalikan ke User 2.'; }
    else if (targetUser === 'USER3') { targetStatus = 'DRAFT_USER3'; message = 'Dikembalikan ke User 3.'; }
    else if (targetUser === 'USER4') { targetStatus = 'DRAFT_USER4'; message = 'Dikembalikan ke User 4.'; }
    else if (targetUser === 'USER5') { targetStatus = 'DRAFT_USER5'; message = 'Dikembalikan ke User 5.'; }
    else { return res.status(400).json({ success: false, message: 'Target rollback tidak valid.' }); }

    const updated = await prisma.document.update({
      where: { id },
      data: { 
        status: targetStatus,
        comment: comment && comment.trim() !== '' ? comment : doc.comment
      }
    });

    const logMessage = comment && comment.trim() !== '' 
      ? `${message} Catatan: ${comment}` 
      : message;

    await logWorkflow(id, userId, doc.status, targetStatus, logMessage);
    await notifyTargetRole(targetStatus, doc.documentNumber);

    res.json({ success: true, message, data: updated });
  } catch (error) {
    next(error);
  }
};


// =====================================================
// DRAFT DOCUMENT
// =====================================================
const draftDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc) return res.status(404).json({ success: false, message: 'Dokumen tidak ditemukan.' });

    let userId = req.user?.id;
    if (!userId) {
      const defaultUser = await prisma.user.findFirst();
      userId = defaultUser ? defaultUser.id : 'e7bdb646-40f5-418c-94aa-f185fd573022';
    }

    let targetStatus = '';
    if (doc.status === 'SUBMITTED_TO_USER1') targetStatus = 'DRAFT_USER2';
    else if (doc.status === 'SUBMITTED_TO_USER2') targetStatus = 'DRAFT_USER3';
    else if (doc.status === 'SUBMITTED_TO_USER3') targetStatus = 'DRAFT_USER4';
    else if (doc.status === 'SUBMITTED_TO_USER4') targetStatus = 'DRAFT_USER5';
    else return res.status(400).json({ success: false, message: 'Status tidak valid untuk dijadikan draft.' });

    const updated = await prisma.document.update({
      where: { id },
      data: { status: targetStatus }
    });

    await logWorkflow(id, userId, doc.status, targetStatus, 'Dokumen dikembalikan menjadi Draft.');
    await notifyTargetRole(targetStatus, doc.documentNumber);

    res.json({ success: true, message: 'Berhasil diubah ke Draft.', data: updated });
  } catch (error) {
    next(error);
  }
};


// =====================================================
// DELETE & RESTORE DOCUMENT
// =====================================================
const deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await prisma.document.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() }
    });
    res.json({ success: true, message: 'Dipindahkan ke sampah.', data: updated });
  } catch (error) {
    next(error);
  }
};

const restoreDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const restored = await prisma.document.update({
      where: { id },
      data: { isDeleted: false, deletedAt: null }
    });
    res.json({ success: true, message: 'Dokumen dipulihkan.', data: restored });
  } catch (error) {
    next(error);
  }
};


// =====================================================
// EXPORTS
// =====================================================
module.exports = {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  submitDocument,
  approveDocument,
  revisionDocument,
  getDocumentHistory,
  rollbackDocument,
  draftDocument,
  deleteDocument,
  restoreDocument
};