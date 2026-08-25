const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const documentRoutes = require('./routes/documentRoutes');
const templateRoutes = require('./routes/templateRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// Konfigurasi CORS yang mengizinkan semua domain (termasuk Vercel dan localhost)
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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