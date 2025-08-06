const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const formRoutes = require('./routes/formRoutes');
const profileRoutes = require('./routes/profileRoutes');

dotenv.config();
connectDB();

const app = express(); // ✅ Make sure this line comes BEFORE any app.use()

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/profile', profileRoutes);

// Root
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
