
const sequelize = require('./config'); 
const User = require('./model');

async function syncDatabase() {
  try {
    await sequelize.sync({ force: true }); 
    console.log('Database synchronized');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  } finally {
    sequelize.close();
  }
}

syncDatabase();
