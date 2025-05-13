import taskModel from "../models/task.model.js";
import projectModel from "../models/project.model.js";
import { checkUserExists } from "../utils/validators.js";
import { validateTaskInput } from "../middlewares/validate.md.js";

// CREATE - Assign Task
const assignTask = async (req, res) => {
  const { title, description, status, assignedTo, projectId } = req.body;
  const user = req.user;

  const { isValid, errorMessage } = validateTaskInput({
    title,
    description,
    assignedTo,
    projectId,
  });

  if (!isValid) {
    return res.status(400).json({ message: errorMessage });
  }

  try {
    if (user.role === 'member') {
      return res.status(403).json({ message: "Members are not allowed to assign tasks" });
    }

    const project = await projectModel.findById(projectId);
    if (!project || project.companyId.toString() !== user.companyId.toString()) {
      return res.status(400).json({ message: "Invalid or unauthorized project" });
    }

    if (!(await checkUserExists(assignedTo))) {
      return res.status(400).json({ message: "Assigned user does not exist" });
    }

    const newTask = await taskModel.create({
      title,
      description,
      status,
      assignedTo,
      projectId,
    });

    return res.status(201).json({
      message: "Task assigned successfully",
      task: newTask,
    });

  } catch (err) {
    console.error("Error assigning task:", err);
    return res.status(500).json({ message: "Server error while assigning task" });
  }
};

// READ - Get All Tasks with Filters & Pagination
const getTasks = async (req, res) => {
  try {
    const { status, assignedTo, projectId, page = 1, limit = 10 } = req.query;
    const user = req.user;

    const filter = {};
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (projectId) filter.projectId = projectId;

    // Filter tasks by projects in the user's company
    const companyProjects = await projectModel.find({ companyId: user.companyId }).select('_id');
    const allowedProjectIds = companyProjects.map(p => p._id);
    filter.projectId = { $in: allowedProjectIds };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tasks = await taskModel
      .find(filter)
      .populate("assignedTo", "name email")
      .populate("projectId", "name")
      .skip(skip)
      .limit(parseInt(limit));

    const total = await taskModel.countDocuments(filter);

    return res.status(200).json({
      tasks,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return res.status(500).json({ message: "Server error while fetching tasks" });
  }
};

// UPDATE - Update Task
const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, status } = req.body;
  const user = req.user;

  try {
    const task = await taskModel.findById(taskId).populate('projectId');
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isSameCompany = task.projectId.companyId.toString() === user.companyId.toString();

    // Allow only assigned member to update their task
    if (user.role === 'member') {
      if (task.assignedTo.toString() !== user.id) {
        return res.status(403).json({ message: "Not authorized to update this task" });
      }
    } else {
      if (!isSameCompany) {
        return res.status(403).json({ message: "Not authorized to update tasks of another company" });
      }
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;

    await task.save();

    return res.status(200).json({
      message: "Task updated successfully",
      task,
    });

  } catch (err) {
    console.error("Error updating task:", err);
    return res.status(500).json({ message: "Server error while updating task" });
  }
};

// DELETE - Delete Task
const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  const user = req.user;

  try {
    const task = await taskModel.findById(taskId).populate('projectId');
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isSameCompany = task.projectId.companyId.toString() === user.companyId.toString();

    if (user.role === 'member') {
      return res.status(403).json({ message: "Members are not allowed to delete tasks" });
    }

    if (!isSameCompany) {
      return res.status(403).json({ message: "Not authorized to delete tasks of another company" });
    }

    await taskModel.findByIdAndDelete(taskId);

    return res.status(200).json({ message: "Task deleted successfully" });

  } catch (err) {
    console.error("Error deleting task:", err);
    return res.status(500).json({ message: "Server error while deleting task" });
  }
};

export default {
  assignTask,
  getTasks,
  updateTask,
  deleteTask,
};
