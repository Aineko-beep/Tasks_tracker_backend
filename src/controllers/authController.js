const { User } = require('../../models');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';

exports.register = async (req, res) => {
    try {
        const { login } = req.body || {};
        if (!login) return res.status(400).json({ error: 'Login is required' });

        const existingUser = await User.findOne({ where: { login } });
        if (existingUser) return res.status(400).json({ error: 'User with this login already exists' });

        const user = await User.create({ login });
        res.status(201).json({ message: 'User registered successfully', user: { id: user.id, login: user.login } });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { login } = req.body;
        if (!login) return res.status(400).json({ error: 'Login is required' });

        const user = await User.findOne({ where: { login } });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, login: user.login }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ message: 'Login successful', token, user: { id: user.id, login: user.login } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.logout = (req, res) => {
    // Stateless JWT: logout handled on client side or token blacklist (not implemented)
    res.json({ message: 'User logged out successfully' });
};

exports.me = async (req, res) => {
    try {
        // middleware should set req.user
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(401).json({ error: 'User not found' });

        res.json({ user: { id: user.id, login: user.login, created_at: user.created_at } });
    } catch (error) {
        console.error('Auth check error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.passwordForgot = async (req, res) => {
    try {
        const { login } = req.body;
        if (!login) return res.status(400).json({ error: 'Login is required' });

        const user = await User.findOne({ where: { login } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const recoveryCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        await user.update({ recovery_code: recoveryCode, recovery_data: JSON.stringify({ generated_at: new Date() }) });

        // In production you would send email. For now return the code in response for testing.
        res.json({ message: 'Recovery code sent to your email', recovery_code: recoveryCode });
    } catch (error) {
        console.error('Password recovery error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.passwordReset = async (req, res) => {
    try {
        const { login, recovery_code } = req.body;
        if (!login || !recovery_code) return res.status(400).json({ error: 'Login and recovery code are required' });

        const user = await User.findOne({ where: { login } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (user.recovery_code !== recovery_code) return res.status(400).json({ error: 'Invalid recovery code' });

        await user.update({ recovery_code: null, recovery_data: null });
        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
