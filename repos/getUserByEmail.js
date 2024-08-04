const getUserByEmail = async (email, datamodels) => {
    try {
        const user = await datamodels.User.findOne({ where: { email } });
        return user;
    } catch (error) {
        console.error('Error in getUserByEmail:', error);
        throw error;
    }
};

module.exports = getUserByEmail;
