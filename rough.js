const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Customers = require('./Schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5003;
const saltRounds = 10;  
const secretKey = 'abcdefghi';  

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

    if (!token) return res.sendStatus(401);  // Unauthorized if no token

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);  // Forbidden if token is invalid
        req.user = user;
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
        

        // Check if user exists //1explanation of this code given below
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
        const token = jwt.sign({ user_name: user.user_name, email: user.email }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token: `Bearer ${token}` });  // Add Bearer to token
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


//1Note: if we use plain text password (storing in db),then this querry may good fit const user = await Customers.findOne({ user_name });
       // if (!user) {
       //     return res.status(401).send("User information wrong"); but now our password is stored in hashed form . so when when user entered password which is 
       //plain text it convert again in hashed formed and then compare it with stored hashed passwored. In detail explaination This approach(code of try api/login ) first finds the user based on their user_name.
//After finding the user, the password entered by the user is compared with the hashed password stored in the database using bcrypt.compare(). This function handles the hashing internally and compares the
 //entered plain-text password against the stored hash.  

 /* Note: multiple return stmt used in code have great significance
app.post('/api/login', async (req, res) => {
    try {
        const { user_name, password } = req.body;
        

        
        const user = await Customers.findOne({ user_name });
        if (!user) {
            return res.status(401).send("User information wrong");  
        } 
            //uses of return here -If the user is not found in the database, the function sends a 401 (Unauthorized) response and immediately stops
            // execution by using return.//This prevents the rest of the code (like password comparison and token generation) from running


        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send("User information wrong");  // Unauthorized if password incorrect
        }
        // uses of return here :  If the hashed password in the database does not match the password provided by the user, a 401 response is sent and 
       // the function exits.If the password is wrong, the user should not be logged in, and no token should be generated. The return here prevents the
        // subsequent JWT generation step from happening.

        //Generating the token:
This step only runs if the previous two checks are successful (i.e., the user exists and the password is correct).
Significance: The token should only be generated for a valid and authenticated user. This is why the token generation comes last in the flow. 
//If any earlier step fails, the rest of the code will not execute due to the return statements.  so finally learn approach for token gen login we use (if !not equal to approach) and
then return.        
        const token = jwt.sign({ user_name: user.user_name, email: user.email }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token: `Bearer ${token}` });  // Add Bearer to token
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

 
 */