const startConversation = async (req, res, llm) => {
    
    let user = req.session.user;
    if(!user) {
        return res.status(401).json({ success: false, message: "Invalid session. " });
    }

    let {topic, thesis} = req.body;
    
    if (typeof topic !== 'string' || topic.trim().length === 0 || topic.trim().length > 200 || typeof thesis !== 'string' || thesis.trim().length > 200) {
        return res.status(400).json({ success: false, message: "Topic and thesis must be strings with less than 200 characters each." });
    }
    topic = topic.trim();
    thesis = thesis.trim();

    try {
        let response = await llm.startConversation(user,topic,thesis);
        res.json({success:true, conversation: response});
    } catch(err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal server error."});
    }

}
module.exports = startConversation;