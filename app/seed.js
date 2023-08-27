const { faker } = require('@faker-js/faker');
const sequelize = require('./config'); 
const User = require('./model');     


async function seedDatabase() {
  try {
    await sequelize.sync({ force: true }); 

    let users = [];
    for (let i = 0; i < 50; i++) {
      const userData = {
        fullname: faker.person.fullName(),
        email: faker.internet.email(),
        sex: faker.person.sexType(),
        avatar: faker.image.avatar(),
        birthday: faker.date.birthdate(),
      };
      users.push(userData);
    }

    await User.bulkCreate(users); // Insert the generated data into the User table

    console.log('Database seeded');
  } catch (error) {
    console.error('Error seeding database:', error.message);
  } finally {
    sequelize.close(); // Close the connection when done
  }
}

seedDatabase();

