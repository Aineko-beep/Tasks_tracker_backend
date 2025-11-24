"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Users', 'username', {
            type: Sequelize.STRING(255),
            allowNull: false,
            unique: true,
        });

        await queryInterface.addColumn('Users', 'hashpassword', {
            type: Sequelize.STRING(255),
            allowNull: false,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Users', 'hashpassword');
        await queryInterface.removeColumn('Users', 'username');
    }
};

