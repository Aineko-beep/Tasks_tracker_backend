const { Task, User } = require('../../models');

exports.listTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({
            include: [{ model: User, as: 'user', attributes: ['id', 'login'] }],
            attributes: ['id', 'title', 'description', 'data', 'status', 'userId', 'created_at', 'updated_at']
        });
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.listUserTasks = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const tasks = await Task.findAll({
            where: { userId },
            include: [{ model: User, as: 'user', attributes: ['id', 'login'] }],
            attributes: ['id', 'title', 'description', 'data', 'status', 'userId', 'created_at', 'updated_at']
        });

        res.json(tasks);
    } catch (error) {
        console.error('Error fetching user tasks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getTask = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id, { include: [{ model: User, as: 'user', attributes: ['id', 'login'] }] });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.createTask = async (req, res) => {
    try {
        const { title, description, data, status, userId } = req.body;
        if (!title) return res.status(400).json({ error: 'Title is required' });
        if (!userId) return res.status(400).json({ error: 'User ID is required' });

        const user = await User.findByPk(userId);
        if (!user) return res.status(400).json({ error: 'User not found' });

        const task = await Task.create({ title, description: description || null, data: data || null, status: status || 'new', userId });

        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        console.error('Error creating task:', error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: 'Invalid status value' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { title, description, data, status, userId } = req.body;
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (data !== undefined) updateData.data = data;
        if (status !== undefined) updateData.status = status;
        if (userId !== undefined) {
            const user = await User.findByPk(userId);
            if (!user) return res.status(400).json({ error: 'User not found' });
            updateData.userId = userId;
        }

        await task.update(updateData);
        res.json({ message: 'Task updated successfully', task });
    } catch (error) {
        console.error('Error updating task:', error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: 'Invalid status value' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        await task.destroy();
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
