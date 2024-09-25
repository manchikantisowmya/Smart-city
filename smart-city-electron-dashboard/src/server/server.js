require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5002;

// const corsOptions = {
//   origin: 'http://localhost:3000', // Replace with your frontend URL
//   methods: ['GET', 'POST'], // Specify sallowed HTTP methods
// };

// app.use(cors(corsOptions));


// Middleware
app.use(cors());
app.use(express.json());

mongoose.set('strictQuery', false);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// API Routes
app.use('/api/auth', authRoutes);

// Serve the React frontend files (important for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}
// MongoDB connection
const client = new MongoClient(process.env.MONGODB_URI || 'mongodb+srv://SCT:data298B@cluster0.fcat7.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const dbName = 'Smart_City_Traffic_DB';
let db;

const connectToDatabase = async () => {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to database');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
};

// Call the connect function
connectToDatabase();

// API Route for authentication
app.use('/api/auth', authRoutes);

// Route to get all cameras
app.get('/api/cameras', async (req, res) => {
  try {
    const cameras = await db.collection('CaltransCamera').find({}).toArray();
    res.json(cameras);
  } catch (err) {
    console.error('Error fetching cameras:', err);
    res.status(500).send('Error fetching cameras');
  }
});

// Route to get camera by ID
app.get('/api/cameras/:camera_id', async (req, res) => {
  try {
    const camera = await db.collection('CaltransCamera').findOne({ camera_id: req.params.camera_id });
    if (camera) {
      res.json(camera);
    } else {
      res.status(404).send('Camera not found');
    }
  } catch (err) {
    console.error('Error fetching camera details:', err);
    res.status(500).send('Error fetching camera details');
  }
});

// Serve the React frontend files (important for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});