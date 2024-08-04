const sendMessage = async (req, res, llm) => {
    
    let user = req.session.user;
    if(!user) {
        return res.status(401).json({ success: false, message: "Invalid session. " });
    }

    const {message} = req.body;
    
    if (typeof message !== 'string' || message.length > 2000) {
        return res.status(400).json({ success: false, message: "Message must be a string with less than 1000 characters." });
    }

    try {
        let response = await llm.conversationAddMessage(user,message);
        res.json({success:true, message: response});
    } catch(err) {
        return res.status(500).json({ success: false, message: "Internal server error."});
    }

}
module.exports = sendMessage;