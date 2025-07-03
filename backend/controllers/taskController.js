const Task = require("../models/Task");
const { taskSchema } = require("../utils/validation");

const createTask = async (req, res, next) => {
  try {
    const { error } = taskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { title, description } = req.body;
    const taskId = await Task.create(req.user.id, title, description);
    res.status(201).json({ message: "Task created successfully", taskId });
  } catch (err) {
    next(err);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.findAllByUserId(req.user.id);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id, req.user.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { error } = taskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { title, description, status } = req.body;
    const task = await Task.findById(req.params.id, req.user.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await Task.update(req.params.id, title, description, status || task.status);
    res.json({ message: "Task updated successfully" });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id, req.user.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await Task.delete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
