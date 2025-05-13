import express from "express";
import companyController from "../controllers/company.controller.js";
import userController from "../controllers/user.controller.js";
import projectController from "../controllers/project.controller.js";
import taskController from "../controllers/task.controller.js";
import { verifyToken } from "../utils/jwtToken.js";
import { authorizeRoles } from "../middlewares/auth.md.js";
import {validateTaskFilter} from '../middlewares/taskFilterValidation.js'

const router = express.Router();
// company Route
router.post("/company/register", companyController.setupCompanyAndAdmin);
// router.get("/company", verifyToken, authorizeRoles("admin"), companyController.getAllCompanies);
router.get("/company/:id", verifyToken, authorizeRoles("admin"), companyController.getCompanyById);
router.put("/company/:id", verifyToken, authorizeRoles("admin"), companyController.updateCompany);
router.delete("/company/:id", verifyToken, authorizeRoles("admin"), companyController.deleteCompany);
// User Routes
router.post("/user/signup", verifyToken, authorizeRoles("admin"), userController.userSignup);
router.get("/", verifyToken, authorizeRoles("admin", "manager"), userController.getUsers);
router.put("/user/:id", verifyToken, userController.updateUser);
router.delete("/user/:id", verifyToken, authorizeRoles("admin"), userController.deleteUser);
router.post("/user/signin", userController.userSignIn);
// Project Routes
router.post('/project/create', verifyToken, authorizeRoles('admin', 'manager'), projectController.createProject);
router.get('/projects', verifyToken,authorizeRoles('admin', 'manager'), projectController.getProjects);
router.put('/project/:projectId', verifyToken, authorizeRoles('admin', 'manager'), projectController.updateProject);
router.delete('/project/:projectId', verifyToken, authorizeRoles('admin', 'manager'), projectController.deleteProject);
// assign Project Task
router.post('/task/assign', verifyToken, authorizeRoles('admin', 'manager'), taskController.assignTask);
router.get('/tasks', verifyToken, validateTaskFilter, taskController.getTasks);
router.put('/task/:taskId', verifyToken, taskController.updateTask);
router.delete('/task/:taskId', verifyToken, authorizeRoles('admin', 'manager'), taskController.deleteTask);


export default router;
