const getTask = (req, res) => {
    res.json([{ id: 1, title: "Mock Task", status: "new" }]);
};

const getTaskId = (req, res) => {
    res.json({ id: req.params.id, title: "Mock Task", status: "done" });
};


const postTask = (req, res) => {
    res.json({ message: "Task created (mock)" });
};

const patchTaskId = (req, res) => {
    res.json({ message: "Task updated (mock)" });
};

const deleteTaskId = (req, res) => {
    res.json({ message: "Task deleted (mock)" });
};

module.exports = {getTask,getTaskId,postTask,patchTaskId,deleteTaskId};