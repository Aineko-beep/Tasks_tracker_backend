'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Task extends Model {
        static associate(models) {
            // Определение ассоциаций здесь
            Task.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user'
            });
        }
    }

    Task.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        data: {
            type: DataTypes.DATE,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('new', 'in_progress', 'completed', 'cancelled'),
            allowNull: false,
            defaultValue: 'new'
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'Task',
        tableName: 'Tasks',
        timestamps: true, // Автоматически добавляет created_at и updated_at
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Task;
};
