const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3003;

// Middleware to parse the request body as JSON
app.use(express.json());

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

// Connect to MongoDB
const mongoURL = 'mongodb://localhost:27017';
const dbName = 'bookdb'; // Replace with your database name

async function connectToMongoDB() {
  const client = new MongoClient(mongoURL, { useUnifiedTopology: true });
  await client.connect();
  return client.db(dbName);
}

// API endpoint for adding book data to MongoDB
app.post('/add-book', async (req, res) => {
  try {
    const book = req.body;
    console.log(book);
    const db = await connectToMongoDB();
    const collection = db.collection('books');
    const result = await collection.insertOne(book);
    res.status(200).json({ message: 'Book added to MongoDB', insertedId: result.insertedId });
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ error: 'Error adding book' });
  }
});

// API endpoint for viewing all books
app.get('/view-books', async (req, res) => {
  try {
    console.log(req.url);
    const db = await connectToMongoDB();
    const collection = db.collection('books');
    const books = await collection.find({}).toArray();
    res.status(200).json(books);
  } catch (error) {
    console.error('Error viewing books:', error);
    res.status(500).json({ error: 'Error viewing books' });
  }
});

// to link our html file
app.use(express.static('public'));
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
