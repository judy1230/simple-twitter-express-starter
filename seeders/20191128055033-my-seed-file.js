'use strict';
const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: "root",
      avatar: faker.image.imageUrl(),
      introduction: faker.lorem.text(),
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: "user1",
      avatar: faker.image.imageUrl(),
      introduction: faker.lorem.text(),
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: "user2",
      avatar: faker.image.imageUrl(),
      introduction: faker.lorem.text(),
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});

   queryInterface.bulkInsert('Tweets',
      Array.from({ length: 5 }).map(d =>
        ({
          description: faker.lorem.text(),
          UserId: Math.floor(Math.random() * 3) + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ), {});
    queryInterface.bulkInsert('Replies',
      Array.from({ length: 5 }).map(d =>
        ({
          TweetId: Math.floor(Math.random() * 10) + 1,
          UserId: Math.floor(Math.random() * 3) + 1,
          comment: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ), {});
    queryInterface.bulkInsert('Followships',
      Array.from({ length: 5 }).map(d =>
        ({
          FollowerId: Math.floor(Math.random() * 3) + 1,
          FollowingId: Math.floor(Math.random() * 3) + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ), {});
    return queryInterface.bulkInsert('Likes',
      Array.from({ length: 5 }).map(d =>
        ({
          UserId: Math.floor(Math.random() * 3) + 1,
          TweetId: Math.floor(Math.random() * 10) + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ), {});
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, {});
    queryInterface.bulkDelete('Tweets', null, {});
  }
};

