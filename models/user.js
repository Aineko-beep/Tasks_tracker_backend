'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // Определение ассоциаций здесь
            User.hasMany(models.Task, {
                foreignKey: 'userId',
                as: 'tasks'
            });
        }
    }

    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        login: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        recovery_code: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        recovery_data: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'Users',
        timestamps: true, // Автоматически добавляет created_at и updated_at
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return User;
};
