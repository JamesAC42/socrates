const evaluate = async (req, res, llm) => {

    let user = req.session.user;
    if(!user) {
        return res.status(401).json({ success: false, message: "Invalid session. " });
    }

    try {
        let evaluation = await llm.evaluateConversation(user);
        res.json({success: true, evaluation});
    } catch(err) {
        console.error(err);
        res.status(500).json({success: false, message: "Internal server error."});
    }

}

module.exports = evaluate;