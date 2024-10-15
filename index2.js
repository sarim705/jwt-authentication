const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Customers = require('./Schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5003;
const saltRounds = 10;  // Increased for stronger security
const secretKey = 'helloabcdef'; 

// Connect to MongoDB
async function run() {
    try {
        await mongoose.connect("mongodb://localhost:27017/customerDB");
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
}
run();

app.use(express.json());
app.use(cors());

// JWT Middleware to Authenticate Token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];  // Extract token after "Bearer"
    console.log(token);

    if (!token) return res.sendStatus(401);  // Unauthorized if no token

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);  // Forbidden if token is invalid
        req.user = user;
        /* WT Payload:

The payload(at bottom of code)typically includes data like user_name or email so that you can access it in protected routes without querying the database again.
If we don’t need to use this user information (e.g., for user-specific actions in a route), we  don’t need to include it in the JWT token.
req.user = user;This line is used to store the decoded payload (like user_name and email) in the req.user object, so we can use it later in our route handlers.
If we don't plan to use this information, it’s not necessary to set req.user = user */
      
        next();
    });
}

// POST endpoint for user registration
app.post('/api/register', async (req, res) => {
    try {
        const { user_name, age, password, email } = req.body;

        // Check if user already exists
        const existingUser = await Customers.findOne({ user_name });
        if (existingUser) {
            return res.status(409).send("User already exists");
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new Customers({ user_name, age, password: hashedPassword, email });
        await newUser.save();
        res.status(201).send("Customer added successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// POST endpoint for user login with JWT issuance
app.post('/api/login', async (req, res) => {
    try {
        const { user_name, password } = req.body;
        

        // Check if user exists
        const user = await Customers.findOne({ user_name });
        if (!user) {
            return res.status(401).send("User information wrong");  // Unauthorized if user not found
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send("User information wrong");  // Unauthorized if password incorrect
        }

        // Generate JWT token with "Bearer" format
        const token = jwt.sign({ user_name: user.user_name, email: user.email }, secretKey, { expiresIn: '1h' });//user_name and email here is used as payload . Generally its style or best paractice to
        // give it however it not necessary.and in this project we not have any use of it 
        res.status(200).json({ message: 'Login successful', token: `Bearer ${token}` });  // Add Bearer to token . 
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
        
    }
});

// A protected route to get customer data (JWT authentication required)
app.get('/api/customers', authenticateToken, async (req, res) => {
    try {
        const customers = await Customers.find();
        res.status(200).json(customers);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// Basic route to check server health
app.get('/', (req, res) => {
    res.status(200).send("Server is running");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
