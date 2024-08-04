const restartConversation = async (req, res, llm) => {
    
    let user = req.session.user;
    if(!user) {
        return res.status(401).json({ success: false, message: "Invalid session. " });
    }

    try {
        await llm.restartUserConversation(user);
        res.json({ success: true });
    } catch(err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal server error."});
    }

}

module.exports = restartConversation;