const { User } = require('../../models');
const bcrypt = require('bcryptjs');

exports.listUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'login', 'username', 'created_at', 'updated_at']
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: ['id', 'login', 'username', 'created_at', 'updated_at']
        });

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { login, username, password, recovery_code, recovery_data } = req.body;

        if (!login || !username || !password) return res.status(400).json({ error: 'Login, username and password are required' });

        const existingUser = await User.findOne({ where: { login } });
        if (existingUser) return res.status(400).json({ error: 'User with this login already exists' });

        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) return res.status(400).json({ error: 'Username already taken' });

        const hash = bcrypt.hashSync(password, 10);

        const user = await User.create({
            login,
            username,
            hashpassword: hash,
            recovery_code: recovery_code || null,
            recovery_data: recovery_data || null
        });

        res.status(201).json({
            message: 'User created successfully',
            user: { id: user.id, login: user.login, username: user.username, created_at: user.created_at }
        });
    } catch (error) {
        console.error('Error creating user:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'User with this login already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { login, username, password, recovery_code, recovery_data } = req.body;

        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const updateData = {};
        if (login !== undefined) updateData.login = login;
        if (username !== undefined) updateData.username = username;
        if (password !== undefined) updateData.hashpassword = bcrypt.hashSync(password, 10);
        if (recovery_code !== undefined) updateData.recovery_code = recovery_code;
        if (recovery_data !== undefined) updateData.recovery_data = recovery_data;

        await user.update(updateData);

        res.json({ message: 'User updated successfully', user: { id: user.id, login: user.login, username: user.username, updated_at: user.updated_at } });
    } catch (error) {
        console.error('Error updating user:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'User with this login already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
