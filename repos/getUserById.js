const getUserById = async (id, datamodels) => {
    try {
        const { User } = datamodels;
        const user = await User.findOne({ where: { id } });
        return user;
    } catch (error) {
        console.error('Error in getUserByEmail:', error);
        throw error;
    }
};

module.exports = getUserById;