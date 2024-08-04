const getUserById = require("../repos/getUserById");

const getSession = async (req, res, datamodels) => {

    let user = req.session.user;
    if(!user) {
        return res.json({success: false, message: "No session found."});
    }

    try {
        let userModel = await getUserById(user, datamodels);
        return res.json({success:true, user: userModel});
    }catch(err) {
        console.error(err);
        return res.status(500).json({success: false, message: "Internal server error."});
    }

}

module.exports = getSession;