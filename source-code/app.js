// Import required modules
const express = require('express');
const { MongoClient } = require('mongodb');

// Configuration for MongoDB connection from environment variables
const dbConfig = {
    url: process.env.MONGO_URL, // MongoDB URI from ENV
    database: process.env.MONGO_DATABASE || 'testdb',        // Database name from ENV
};

const delayTime = parseInt(process.env.DELAY_TIME, 10) || 5000; // Delay time in milliseconds from ENV

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Function to introduce a delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// API POST: Ghi dữ liệu vào database
app.post('/data', async (req, res) => {
    const client = new MongoClient(dbConfig.url);

    try {
        // Kết nối đến MongoDB
        await client.connect();

        console.log(`Connected to MongoDB. Delaying for ${delayTime}ms before writing to the database...`);
        await delay(delayTime); // Delay before writing data

        // Lấy dữ liệu từ body request
        const { name, value } = req.body;
        if (!name || !value) {
            return res.status(400).send({ error: 'Name and value are required' });
        }

        // Ghi dữ liệu vào database
        const db = client.db(dbConfig.database);
        const collection = db.collection('test_collection');
        const data = { name, value, timestamp: new Date() };
        const result = await collection.insertOne(data);

        res.status(201).send({ message: 'Data inserted successfully', id: result.insertedId });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: 'Internal server error' });
    } finally {
        // Đóng kết nối
        await client.close();
    }
});

// API GET: Lấy dữ liệu từ database
app.get('/data', async (req, res) => {
    const client = new MongoClient(dbConfig.url);

    try {
        // Kết nối đến MongoDB
        await client.connect();

        // Lấy dữ liệu từ database
        const db = client.db(dbConfig.database);
        const collection = db.collection('test_collection');
        const data = await collection.find({}).toArray();

        res.status(200).send(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: 'Internal server error' });
    } finally {
        // Đóng kết nối
        await client.close();
    }
});

// API Health Check
app.get('/health', (req, res) => {
    res.status(200).send({ status: 'UP' });
});

// Khởi động server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
