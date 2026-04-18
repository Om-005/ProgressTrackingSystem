const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/tasks', require('./routes/tasks'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

// Database connection
const connectDB = async () => {
  let uri = process.env.MONGODB_URI;
  
  try {
    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\n⚠️ ERROR: ${error.message}`);
    console.log("⚠️ CLOUD MONGODB CONNECTION BLOCKED BY YOUR WIFI FIREWALL ⚠️");
    console.log("Automatically falling back to Local In-Memory Database...");
    
    try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        uri = mongoServer.getUri();
        await mongoose.connect(uri);
        console.log(`Local MongoDB Connected`);
        console.log("Note: Data will reset when you restart the server.");
    } catch (fallbackError) {
        console.error(`Failed to start memory server: ${fallbackError.message}`);
        process.exit(1);
    }
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}\n------------------------------------------------`);
  });
};

connectDB();
