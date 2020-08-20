const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/friendslistapp');

const Friends = db.define('friends', {
    name: Sequelize.STRING,
    rating: {
        type: Sequelize.INTEGER
    }
})

module.exports = {
    db,
    Friends
}