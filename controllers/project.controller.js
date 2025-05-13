import projectModel from "../models/project.model.js";
import {
  checkCompanyExists,
  checkUserExists,
} from "../utils/validators.js";
import { validateProjectInput } from "../middlewares/validate.md.js";

// CREATE Project
const createProject = async (req, res) => {
  const { name, description } = req.body;
  const createdBy = req.user.id;
  const companyId = req.user.companyId.toString();

  const { isValid, errorMessage } = validateProjectInput({
    name,
    description,
    createdBy,
    companyId,
  });

  if (!isValid) {
    return res.status(400).json({ message: errorMessage });
  }

  try {
    if (!(await checkCompanyExists(companyId))) {
      return res.status(400).json({ message: "Invalid company ID" });
    }

    if (!(await checkUserExists(createdBy))) {
      return res.status(400).json({ message: "Invalid creator (user ID)" });
    }

    const existingProject = await projectModel.findOne({ name, companyId });
    if (existingProject) {
      return res.status(400).json({ message: "Project name already exists in your company" });
    }

    const newProject = await projectModel.create({
      name,
      description,
      createdBy,
      companyId,
    });

    return res.status(201).json({
      message: "Project created successfully",
      project: newProject,
    });
  } catch (err) {
    console.error("Error Creating Project:", err.message || err);
    return res.status(500).json({ message: "Server error" });
  }
};


// GET All Projects (optionally by company or creator)
const getProjects = async (req, res) => {
  try {
    const filter = {};
    if (req.query.companyId) filter.companyId = req.query.companyId;
    if (req.query.createdBy) filter.createdBy = req.query.createdBy;

    const projects = await projectModel.find(filter).populate("createdBy", "name").populate("companyId", "name");

    return res.status(200).json({ projects });
  } catch (err) {
    console.error("Error Fetching Projects", err);
    return res.status(500).json({ error: "Failed to fetch projects" });
  }
};

// UPDATE Project
const updateProject = async (req, res) => {
  const { projectId } = req.params;
  const { name, description } = req.body;

  try {
    const existingProject = await projectModel.findById(projectId);
    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (name) existingProject.name = name;
    if (description) existingProject.description = description;

    await existingProject.save();

    return res.status(200).json({
      message: "Project updated successfully",
      project: existingProject,
    });
  } catch (err) {
    console.error("Error Updating Project", err);
    return res.status(500).json({ error: "Failed to update project" });
  }
};

// DELETE Project
const deleteProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    const deleted = await projectModel.findByIdAndDelete(projectId);
    if (!deleted) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Error Deleting Project", err);
    return res.status(500).json({ error: "Failed to delete project" });
  }
};

export default {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
};
