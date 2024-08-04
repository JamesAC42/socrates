const getConversation = async (req, res, llm) => {
    
    let user = req.session.user;
    if(!user) {
        return res.status(401).json({ success: false, message: "Invalid session. " });
    }

    try {
        const conversation = await llm.getUserConversation(user);
        res.json({ success: true, conversation });
    } catch(err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal server error."});
    }

}

module.exports = getConversation;