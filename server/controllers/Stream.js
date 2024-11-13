const dotenv = require('dotenv');
dotenv.config();
const StreamChat = require('stream-chat').StreamChat;
const StreamClient = StreamChat.getInstance(process.env.REACT_APP_STREAM_CHAT_API_KEY, process.env.REACT_APP_STREAM_CHAT_SECRET);

const createToken = async(req, res)=>{
    try {
        const { userId } = req.body

        if (!userId) {
            return res.status(400).json({ message: 'UserId is required' });
        }

        const token = StreamClient.createToken(userId)

        return res.status(200).json({token})
    } catch (error) {
        console.log(error)
    }
}

const updateUser = async (req, res) => {
    try {
        const { name, tag, bio, email, imgUrl, userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const response = await StreamClient.upsertUser({
            id: userId,
            name,
            tag,
            bio,  // Use lowercase "bio"
            email,
            image: imgUrl,
        });

        return res.status(200).json({
            message: "User profile updated successfully in Stream",
            data: response,
        });
    } catch (error) {
        console.error("Error updating user profile in Stream:", error);
        return res.status(500).json({ error: "Failed to update Stream user profile" });
    }
};


module.exports ={
    createToken,
    updateUser
} 