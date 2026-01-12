const { User } = require('../../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const getMailTransporter = () => {
    const mailUser = process.env.MAIL_USER;
    const mailPassword = process.env.MAIL_PASSWORD;

    if (!mailUser || !mailPassword) {
        console.error('MAIL_USER or MAIL_PASSWORD is not set in environment variables');
        return null;
    }

    return nodemailer.createTransport({
        host: process.env.MAIL_HOST || 'smtp.yandex.ru',
        port: Number(process.env.MAIL_PORT) || 465,
        secure: true,
        auth: {
            user: mailUser,
            pass: mailPassword
        }
    });
};

exports.register = async (req, res) => {
    try {
        console.log('register hit, body:', req.body);

        const { login, username, password } = req.body || {};
        if (!login || !username || !password) return res.status(400).json({ error: 'Login, username and password are required' });

        const existingUser = await User.findOne({ where: { login } });
        if (existingUser) return res.status(400).json({ error: 'User with this login already exists' });

        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) return res.status(400).json({ error: 'Username already taken' });

        const hash = bcrypt.hashSync(password, 10);

        const user = await User.create({ login, username, hashpassword: hash });
        res.status(201).json({ message: 'User registered successfully', user: { id: user.id, login: user.login, username: user.username } });
    } catch (error) {
        console.error('Registration error:', error);

        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message).join(', ');
            return res.status(400).json({ error: `Validation error: ${errors}` });
        }

        if (error.name === 'SequelizeUniqueConstraintError') {
            const field = error.errors[0]?.path || 'field';
            return res.status(400).json({ error: `${field} already exists` });
        }

        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { login, password } = req.body;
        if (!login || !password) return res.status(400).json({ error: 'Login and password are required' });

        const user = await User.findOne({ where: { login } });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const valid = bcrypt.compareSync(password, user.hashpassword);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, login: user.login, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ message: 'Login successful', token, user: { id: user.id, login: user.login, username: user.username } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.logout = (req, res) => {
    res.json({ message: 'User logged out successfully' });
};

exports.me = async (req, res) => {
    try {
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
        if (!login) return res.status(400).json({ error: 'Login (email) is required' });

        const user = await User.findOne({ where: { login } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const recoveryToken = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
        const recoveryData = { generated_at: new Date().toISOString() };

        await user.update({
            recovery_code: recoveryToken,
            recovery_data: JSON.stringify(recoveryData)
        });

        const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const resetLink = `${frontendBaseUrl}/reset-password?login=${encodeURIComponent(login)}&token=${encodeURIComponent(recoveryToken)}`;

        const transporter = getMailTransporter();
        if (!transporter) {
            return res.status(500).json({ error: 'Email service is not configured. Please check MAIL_USER and MAIL_PASSWORD in .env file' });
        }

        await transporter.sendMail({
            from: process.env.MAIL_FROM || process.env.MAIL_USER || 'shaboha2004@yandex.ru',
            to: login,
            subject: 'Восстановление пароля',
            text: `Вы запросили восстановление пароля.\nПерейдите по ссылке, чтобы сбросить пароль:\n${resetLink}\n\nЕсли вы не запрашивали восстановление, просто игнорируйте это сообщение.`,
            html: `<p>Вы запросили восстановление пароля.</p>
                   <p>Перейдите по ссылке, чтобы сбросить пароль:</p>
                   <p><a href="${resetLink}">${resetLink}</a></p>
                   <p>Если вы не запрашивали восстановление, просто игнорируйте это сообщение.</p>`
        });

        res.json({ message: 'Password reset link has been sent to your email' });
    } catch (error) {
        console.error('Password recovery error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.passwordReset = async (req, res) => {
    try {
        const { login, token, new_password } = req.body;
        if (!login || !token || !new_password) {
            return res.status(400).json({ error: 'Login, token and new_password are required' });
        }

        const user = await User.findOne({ where: { login } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (!user.recovery_code || user.recovery_code !== token) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        try {
            const data = user.recovery_data ? JSON.parse(user.recovery_data) : null;
            if (data && data.generated_at) {
                const generatedAt = new Date(data.generated_at);
                const now = new Date();
                const diffMinutes = (now - generatedAt) / (1000 * 60);
                const maxMinutes = Number(process.env.RESET_TOKEN_TTL_MINUTES) || 60;
                if (diffMinutes > maxMinutes) {
                    return res.status(400).json({ error: 'Token has expired' });
                }
            }
        } catch (e) {
            console.warn('Failed to parse recovery_data for user', user.id, e);
        }

        const hash = bcrypt.hashSync(new_password, 10);
        await user.update({
            hashpassword: hash,
            recovery_code: null,
            recovery_data: null
        });

        res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
