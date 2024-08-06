const bcrypt = require('bcrypt');
const getUserByEmail = require('../repos/getUserByEmail');
const { v4 } = require('uuid');

const createUser = async (req, res, datamodels) => {

    let { username, password, email } = req.body;

    username = username.trim();
    email = email.trim();
    password = password.trim();

    email = email.toLowerCase();

    if (!username || !password || !email) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    if (username.length > 50 || password.length > 50 || email.length > 100) {
        return res.status(400).json({ success: false, message: 'Input exceeds maximum length' });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return setErrorMessage("Invalid email format");
    }

    try {

        const existingUser = await getUserByEmail(email, datamodels);
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User with that email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const dateCreated = new Date();
        const userId = v4();
        const newUser = await datamodels.User.create({
            id: userId,
            email: email,
            date_created: dateCreated,
            google_id: "",
            name: username,
            tier: 1,
            password: hashedPassword
        });

        req.session.user = userId;

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: newUser
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
module.exports = createUser;