const { OAuth2Client } = require('google-auth-library');
const googleAuth = require("../google_oauth.json");
const getUserByEmail = require('../repos/getUserByEmail');
const { v4 } = require('uuid');

const client = new OAuth2Client(googleAuth.client_id);

const login  = async (req, res, datamodels) => {

    const { token } = req.body;
    if(!token) {
        return res.status(500).send({success:false, message: "Invalid token" });
    }

    try {

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: googleAuth.client_id
        });

        const payload = ticket.getPayload();
        
        // Extract relevant information from the payload
        const googleId = payload['sub'];  // This is the Google ID
        const email = payload['email'];
        const name = payload['name'];

        let userModel = await getUserByEmail(email, datamodels);
        if(!userModel) {
            const userId = v4();
            userModel = await datamodels.User.create({
                id: userId,
                email: email,
                date_created: new Date(),
                google_id: googleId,
                name: name,
                tier: 1
            });
            req.session.user = userId;
        } else {
            req.session.user = userModel.id;
        }

        res.status(200).json({
            success:true,
            user: userModel
        });

    } catch (error) {
        console.error('Error verifying Google token:', error);
        res.status(401).json({ message: 'Authentication failed' });
    }

}

module.exports = login;