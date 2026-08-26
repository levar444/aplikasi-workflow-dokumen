const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Tambahkan modul fs

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const documentRoutes = require('./routes/documentRoutes');
const templateRoutes = require('./routes/templateRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// PASTIKAN FOLDER UPLOADS ADA (Jika belum ada di server, otomatis dibuat)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/uploads', express.static(uploadDir));
app.use('/api/uploads', express.static(uploadDir));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/upload', uploadRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});