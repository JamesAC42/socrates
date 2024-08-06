const bcrypt = require('bcrypt');

const loginEmail = async (req, res, datamodels) => {

    let { email, password } = req.body;
    if (!email || !password || email.trim() === "" || password.trim() === "") {
        res.send({ success: false, message: "Fields cannot be empty." });
        return;
    }

    email = email.toLowerCase();

    try {
        const foundUser = await datamodels.User.findOne({
            where: {
                email
            }
        });

        if (!foundUser) {
            res.send({ success: false, message: "Email or password is incorrect." });
            return;
        }

        if(!foundUser.password) {
            return res.send({ success: false, message: "An account with that email doesn't exist. Did you use Google to sign in with this email?"});
        }

        console.log(password, foundUser);

        const result = await bcrypt.compare(password, foundUser.password);
        if (!result) {
            res.send({ success: false, message: "Email or password is incorrect." });
            return;
        }

        req.session.user = foundUser.id;
        res.json({ 
            success: true,
            user: foundUser
        });
    } catch (err) {
        console.error('Error during login process:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
module.exports = loginEmail;