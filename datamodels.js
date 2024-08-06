const { DataTypes } = require('sequelize');
const sequelize = require('./database.js');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  date_created: {
    type: DataTypes.DATE,
    allowNull: false
  },
  google_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  tier: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  password: {
    type:DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: false // Since we're using a custom date_created field
});

module.exports = {
    User
}