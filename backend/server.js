const express = require('express');
const app = express();
const PORT = 5000;
const User = require('./modal'); 
const mongoose = require('mongoose');
const cors = require('cors');

// Middleware for parsing JSON
app.use(express.json());
app.use(cors()); // Add this line to enable CORS

const db = "mongodb+srv://athreya:123@cluster0.xcjry.mongodb.net/";

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB is connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}
connectDB();

// Sample API endpoint
app.get('/api', (req, res) => {
    res.json({ message: 'Hello from Express!' });
});

// write /api/account/sign-in post api
app.post('/api/account/sign-in', async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log(email, password);
        const user = await User.findOne({ email: email, password: password });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        // save user record with is logged in true
        user.loggedIn = true;
        await user.save();
        res.status(200).json({ message: 'Login successful!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.post('/api/account/sign-out', async (req, res) => {
    const { email } = req.body;
    try {
        console.log(email);
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // save user record with is logged in false
        user.loggedIn = false;
        await user.save();
        res.status(200).json({ message: 'Logout successful!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});