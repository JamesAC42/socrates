const getUserById = require("../repos/getUserById");

function getEvalCount(user, cache) {
    return new Promise(function(resolve, reject) {
        cache.get("socrates:evaluation_count:" + user, (err, result) => {
            if(err) {
                reject(err);
            } else {
                if(!result) {
                    resolve(0);
                } else {
                    resolve(parseInt(result));
                }
            }
        })
    });
}

function setEvalCount(user, count, cache) {
    return new Promise((resolve, reject) => {
        cache.set("socrates:evaluation_count:" + user, count, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

const evaluate = async (req, res, llm, datamodels, cache) => {

    let user = req.session.user;
    if(!user) {
        return res.status(401).json({ success: false, message: "Invalid session. " });
    }

    try {

        const userModel = await getUserById(user, datamodels);
        let numEvals = await getEvalCount(user, cache);
        numEvals = numEvals ? parseInt(numEvals) : 0;
        if(userModel.tier === 1 && numEvals >= 5) {
            return res.send({ success: false, message: "Evaluation limit reached. Free accounts can view up to 5 conversation evaluations."})
        }

        let evaluation = await llm.evaluateConversation(user);
        
        await setEvalCount(user, numEvals + 1, cache);
        res.json({success: true, evaluation});

    } catch(err) {
        console.error(err);
        res.status(500).json({success: false, message: "Internal server error."});
    }

}

module.exports = evaluate;