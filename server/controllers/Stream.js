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

module.exports ={
    createToken
} 