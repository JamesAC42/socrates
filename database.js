const { Sequelize } = require('sequelize');
const psqlLogin = require('./psql_login.json');

const sequelize = new Sequelize(`postgres://${psqlLogin.username}:${psqlLogin.password}@localhost:5432/socrates`, {
    logging:false
});

module.exports = sequelize;