const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL?.replace(/\/+$/, ''), // Strip trailing slashes
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());

// Health check endpoint (useful for Render)
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Taskflow API is running' });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' 
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/tasks', require('./routes/tasks'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

// Database connection with retry logic
const connectDB = async (retries = 5) => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI environment variable is not set');
    process.exit(1);
  }

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`🔄 Attempting to connect to MongoDB (attempt ${i + 1}/${retries})...`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 15000,
        retryWrites: true,
        w: 'majority',
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return; // Success - exit the retry loop
    } catch (error) {
      console.error(`❌ MongoDB connection attempt ${i + 1} failed: ${error.message}`);
      if (i < retries - 1) {
        const waitTime = Math.min(1000 * Math.pow(2, i), 10000);
        console.log(`⏳ Retrying in ${waitTime / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  console.error('❌ All MongoDB connection attempts failed. Exiting.');
  process.exit(1);
};

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

const startServer = async () => {
  await connectDB();
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
    console.log(`🌍 Allowed origins: ${allowedOrigins.join(', ')}`);
  });
};

startServer();
