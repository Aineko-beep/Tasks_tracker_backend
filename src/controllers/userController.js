const User = require("../../models/user");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'status'],
            raw: true
        });
        
        const response = users.map(user => ({
            id: user.id,
            title: user.name,
            status: user.status || 'new'
        }));
        
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении пользователей' });
    }
};

// Получение пользователя по ID
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId, {
            attributes: ['id', 'name', 'email', 'status'],
            raw: true
        });
        
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        
        res.status(200).json({
            id: user.id,
            title: user.name,
            status: user.status || 'new'
        });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении пользователя' });
    }
};

// Создание нового пользователя
const postUserCreated = async (req, res) => {
    try {
        const { name, email, status } = req.body;
        
        const newUser = await User.create({
            name,
            email,
            status: status || 'new',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        res.status(201).json({
            message: 'Пользователь создан',
            user: {
                id: newUser.id,
                title: newUser.name,
                status: newUser.status
            }
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
        }
        res.status(500).json({ error: 'Ошибка при создании пользователя' });
    }
};

// Обновление пользователя
const patchUserUpdated = async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;
        
        const user = await User.findByPk(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        
        await user.update(updateData);
        
        res.status(200).json({
            message: 'Пользователь обновлен',
            user: {
                id: user.id,
                title: user.name,
                status: user.status
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при обновлении пользователя' });
    }
};

// Удаление пользователя
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        
        const user = await User.findByPk(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        
        await user.destroy();
        
        res.status(200).json({ message: 'Пользователь удален' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при удалении пользователя' });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    postUserCreated,
    patchUserUpdated,
    deleteUser
};


