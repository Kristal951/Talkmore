const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { Client, Account, Databases, Avatars, Query } = require("appwrite");
const StreamChat = require("stream-chat").StreamChat;
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
const emailjs = require("@emailjs/nodejs");

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);
const StreamClient = StreamChat.getInstance(
  process.env.REACT_APP_STREAM_CHAT_API_KEY,
  process.env.REACT_APP_STREAM_CHAT_SECRET
);
const AppwriteClient = new Client();
const account = new Account(AppwriteClient);
const databases = new Databases(AppwriteClient);
const avatars = new Avatars(AppwriteClient);

// Appwrite setup
AppwriteClient.setEndpoint("https://cloud.appwrite.io/v1").setProject(
  "670ea1ea0016e28a21d8"
); // Replace with your project ID

const createGoogleUser = async (req, res) => {
    const { token } = req.body;
  
    if (!token) {
      return res
        .status(400)
        .json({ message: "Token is missing from request body." });
    }
  
    try {
      // 1. Verify token
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      });
  
      const payload = ticket.getPayload();
      if (!payload) {
        return res
          .status(401)
          .json({ message: "Invalid token. Verification failed." });
      }
  
      const { name, sub, email, picture } = payload;
  
      // 2. Check if user already exists in Appwrite
      const existingUsers = await databases.listDocuments(
        "6713a7c9001581fc5175",
        "6713a7d200190a7a8f52",
        [Query.equal("email", email)]
      );
  
      if (existingUsers.total > 0) {
        return res
          .status(400)
          .json({ message: "A user already exists with this email." });
      }
  
      // 3. Create Appwrite document
      const appwritePayload = await databases.createDocument(
        "6713a7c9001581fc5175",
        "6713a7d200190a7a8f52",
        sub,
        {
          name,
          AuthProvider: "google",
          imgURL: picture,
          email,
          tag: name,
        }
      );
  
      // 4. Create JWT
      const jwtPayload = {
        id: appwritePayload.$id,
        name: appwritePayload.name,
        email: appwritePayload.email,
        tag: appwritePayload.tag,
        provider: appwritePayload.AuthProvider,
        imgURL: appwritePayload.imgURL,
        Bio: appwritePayload.Bio,
      };
  
      const jwtToken = jwt.sign(jwtPayload, process.env.TOKEN_SECRET, {
        expiresIn: "24h",
      });
  
      // 5. Stream token
      const streamUserTokenResponse = await axios.post(
        "http://localhost:5000/stream/token",
        { userId: sub }
      );
  
      const userToken = streamUserTokenResponse.data.token;

      const streamPayload = await StreamClient.upsertUser(
        {
          id: sub,
          name,
          email,
          image: picture,
          tag: name,
          Bio: appwritePayload.Bio,
        },
        userToken
      );
  
      const templateParams = {
        user_name: name,
        user_email: email,
      };
  
      await emailjs.send(
        process.env.EMAILJS_SERVICE_ID,
        process.env.EMAILJS_WELCOME_TEMPLATE_ID,
        templateParams,
        {
          publicKey: process.env.EMAILJS_PUBLIC_KEY,
          privateKey: process.env.EMAILJS_PRIVATE_KEY,
        }
      ).then(res=>{
        console.log(res)
      }).catch(err=>{
        console.log(err)
      })
  
      return res.status(201).json({
        message: "User created successfully",
        jwtToken,
      });
    } catch (err) {
      console.error("Google SignUp Error:", err.message);
      if (
        err.message?.includes("Wrong number of segments") ||
        err.message?.includes("invalid_token")
      ) {
        return res.status(401).json({ message: "Invalid token." });
      }
  
      return res.status(500).json({
        message: "An error occurred during sign-up.",
        error: err.message,
      });
    }
  };
  
const SignUpUser = async (req, res) => {
  try {
    const userId = uuidv4();
    const secret = process.env.TOKEN_SECRET;
    const { name, tag, password, email } = req.body.userPayload;

    if (!password || !email) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if user already exists
    const existingUsers = await databases.listDocuments(
      "6713a7c9001581fc5175", // Database ID
      "6713a7d200190a7a8f52", // Collection ID
      [Query.equal("email", email)] // Query to check if email exists
    );

    const existingUserWithSameTag = await databases.listDocuments(
      "6713a7c9001581fc5175", // Database ID
      "6713a7d200190a7a8f52", // Collection ID
      [Query.equal("tag", tag)] // Query to check if email exists
    );

    if (existingUsers.total > 0) {
      return res
        .status(400)
        .json({ message: "A user already exists with this email" });
    }
    
    if (existingUserWithSameTag.total > 0) {
      return res
        .status(400)
        .json({ message: "A user already exists with this tag" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate an avatar URL using Appwrite Avatars service
    const imgURL = avatars.getInitials(name);
    const avatarURL = imgURL.href;

    // Create user document in Appwrite
    const appwritePayload = await databases.createDocument(
      "6713a7c9001581fc5175", // Database ID
      "6713a7d200190a7a8f52",
      userId,
      {
        name,
        tag,
        passKey: hashedPassword,
        imgURL: avatarURL,
        email,
        AuthProvider: "email",
      }
    );

    const jwtPayload = {
      id: appwritePayload.$id,
      name: appwritePayload.name,
      email: appwritePayload.email,
      tag: appwritePayload.tag,
      provider: appwritePayload.AuthProvider,
      imgURL: appwritePayload.imgURL,
      Bio: appwritePayload.Bio,
    };

    const jwtToken = jwt.sign(jwtPayload, process.env.TOKEN_SECRET, {
      expiresIn: "24h",
    });

    const userTokenResponse = await axios.post(
      "http://localhost:5000/stream/token",
      { userId }
    );
    const userToken = userTokenResponse.data.token;

    // Add user to Stream Chat
    const streamPayload = await StreamClient.upsertUser(
      {
        id: userId,
        name: name,
        email: email,
        image: avatarURL,
        tag: tag,
        Bio: appwritePayload.Bio,
      },
      userToken
    );

    return res.status(201).json({
      message: "User created successfully",
      jwtToken,
    });
  } catch (error) {
    console.error("SignUpUser Error:", error.message);
    return res.status(500).json({
      message: "An error occurred during sign-up",
      error: error.message,
    });
  }
};

const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password)

    // Query to find the user by email
    const existingUsers = await databases.listDocuments(
      "6713a7c9001581fc5175", // Database ID
      "6713a7d200190a7a8f52", // Collection ID
      [Query.equal("email", email)]
    );

    if (existingUsers.documents.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = existingUsers.documents[0];

    if(user.AuthProvider !== "email"){
      return res
        .status(400)
        .json({ message: "Please Login With Google." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passKey);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const jwtPayload = {
      id: user.$id,
      name: user.name,
      email: user.email,
      tag: user.tag,
      provider: user.AuthProvider,
      imgURL: user.imgURL,
      Bio: user.Bio,
    };

    const jwtToken = jwt.sign(jwtPayload, process.env.TOKEN_SECRET, {
      expiresIn: "24h",
    });

    return res
      .status(200)
      .json({ message: "Login successful", jwtToken });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "An error occurred during login" });
  }
};

const loginUserWithGoogle = async(req, res)=>{
  const { token } = req.body;
  
  if (!token) {
    return res
      .status(400)
      .json({ message: "Token is missing from request body." });
  }
  
  try{
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res
        .status(401)
        .json({ message: "Invalid token. Verification failed." });
    }

    const { sub, email} = payload;

    const existingUsers = await databases.listDocuments(
      "6713a7c9001581fc5175",
      "6713a7d200190a7a8f52",
      [Query.equal("email", email)]
    );

    if (existingUsers.documents.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const existingUser = existingUsers.documents[0]

    if (existingUsers.total) {
      if(existingUser.AuthProvider !== "google"){
        return res
          .status(400)
          .json({ message: "Please Login With Email and password." });
      }
      
      if(existingUser.$id === sub && existingUser.AuthProvider === "google" ){
        const jwtPayload = {
          id: existingUser.$id,
          name: existingUser.name,
          email: existingUser.email,
          tag: existingUser.tag,
          provider: existingUser.AuthProvider,
          imgURL: existingUser.imgURL,
          Bio: existingUser.Bio,
        };
        const jwtToken = jwt.sign(jwtPayload, process.env.TOKEN_SECRET, {
          expiresIn: "24h",
        });
        return res.status(200).json({jwtToken})
      }

    return res
        
    }

    

  }catch{

  }
}

const SearchUser = async (req, res) => {
  const { query } = req.body;

  // Early return for empty or invalid query
  if (!query || query.trim().length === 0) {
    return res.status(400).json({ error: "Search query cannot be empty." });
  }

  try {
    const posts = await databases.listDocuments(
      "6713a7c9001581fc5175", // your DB ID
      "6713a7d200190a7a8f52", // your collection ID
      [Query.contains("name", query)]
    );

    return res.status(200).json({ posts });
  } catch (error) {
    console.error("SearchUser error:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  SignUpUser,
  LoginUser,
  SearchUser,
  createGoogleUser,
  loginUserWithGoogle
};
