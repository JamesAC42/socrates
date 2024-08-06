const getUserById = require("../repos/getUserById");

const sendMessage = async (req, res, llm, datamodels) => {
    
    let user = req.session.user;
    if(!user) {
        return res.status(401).json({ success: false, message: "Invalid session. " });
    }

    const {message} = req.body;
    
    if (typeof message !== 'string' || message.length > 2000) {
        return res.status(400).json({ success: false, message: "Message must be a string with less than 2000 characters." });
    }

    try {
        const userModel = await getUserById(user, datamodels);
        if(!userModel) {
            throw new Error("User not found.");
        }
        let response = await llm.conversationAddMessage(user,message,userModel.tier === 2);
        res.json({success:true, message: response});
    } catch(err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal server error."});
    }

}
module.exports = sendMessage;