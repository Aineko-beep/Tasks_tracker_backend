
"use strict";

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const users = [
      {
        login: 'admin',
        username: 'admin',
        hashpassword: bcrypt.hashSync('adminpass', 10),
        recovery_code: null,
        recovery_data: null,
        created_at: now,
        updated_at: now
      },
      {
        login: 'user1',
        username: 'user1',
        hashpassword: bcrypt.hashSync('user1pass', 10),
        recovery_code: null,
        recovery_data: null,
        created_at: now,
        updated_at: now
      }
    ];

    await queryInterface.bulkDelete('Users', { login: ['admin', 'user1'] }, {});
    await queryInterface.bulkInsert('Users', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { login: ['admin', 'user1'] }, {});
  }
};
