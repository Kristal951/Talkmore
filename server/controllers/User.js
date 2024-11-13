const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { Client, Account, Databases, Avatars, Query } = require('appwrite');
const StreamChat = require('stream-chat').StreamChat;
const jwt = require('jsonwebtoken');
const axios = require('axios');

// Initialize Appwrite and Stream Chat Clients
const StreamClient = StreamChat.getInstance(process.env.REACT_APP_STREAM_CHAT_API_KEY, process.env.REACT_APP_STREAM_CHAT_SECRET);
const AppwriteClient = new Client();
const account = new Account(AppwriteClient);
const databases = new Databases(AppwriteClient);
const avatars = new Avatars(AppwriteClient);

// Appwrite setup
AppwriteClient
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('670ea1ea0016e28a21d8'); // Replace with your project ID

const SignUpUser = async (req, res) => {
    try {
        console.log(req.body);

        const userId = uuidv4();
        const secret = process.env.TOKEN_SECRET;
        const { name, tag, phoneNumber, password, email } = req.body.userPayload;

        if (!password || !email) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check if user already exists
        const existingUsers = await databases.listDocuments(
            '6713a7c9001581fc5175',  // Database ID
            '6713a7d200190a7a8f52',  // Collection ID
            [Query.equal('email', email)] // Query to check if email exists
        );

        if (existingUsers.total > 0) {
            return res.status(400).json({ message: 'A user already exists with this email' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate an avatar URL using Appwrite Avatars service
        const imgURL = avatars.getInitials(name);
        const avatarURL = imgURL.href

        // Create a JWT token
        const jwtToken = jwt.sign({ userId }, secret, { expiresIn: '24h' });

        // Create user document in Appwrite
        const appwritePayload = await databases.createDocument(
            '6713a7c9001581fc5175',  // Database ID
            '6713a7d200190a7a8f52',
            userId,
            {
                name,
                tag,
                phoneNumber,
                passKey: hashedPassword,
                imgURL: avatarURL,
                email
            }
        );

        const userTokenResponse = await axios.post('http://localhost:5000/stream/token', { userId });
        const userToken = userTokenResponse.data.token;

        // Add user to Stream Chat
        const streamPayload = await StreamClient.upsertUser(
            {
                id: userId,
                name: name,
                email: email,
                image: avatarURL,
                tag: tag,
                Bio: appwritePayload.Bio
            },
            userToken
        );
        const createdUser = streamPayload.users[userId];

        return res.status(201).json({
            message: 'User created successfully',
            createdUser,
            appwritePayload,
            jwtToken
        });
    } catch (error) {
        console.error('SignUpUser Error:', error.message);
        return res.status(500).json({ message: 'An error occurred during sign-up', error: error.message });
    }
};

const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Query to find the user by email
        const existingUsers = await databases.listDocuments(
            '6713a7c9001581fc5175',  // Database ID
            '6713a7d200190a7a8f52',  // Collection ID
            [Query.equal('email', email)]
        );

        const secret = process.env.TOKEN_SECRET;

        if (existingUsers.documents.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = existingUsers.documents[0];

        const isPasswordValid = await bcrypt.compare(password, user.passKey);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const userId = user.$id

        const jwtToken = jwt.sign({ userId }, secret, { expiresIn: '24h' });

        return res.status(200).json({ message: 'Login successful', user, jwtToken });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'An error occurred during login' });
    }
};

module.exports = LoginUser;

module.exports = {
    SignUpUser,
    LoginUser
};
