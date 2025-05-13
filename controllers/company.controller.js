import bcrypt from "bcryptjs";
import companyModel from "../models/company.model.js";
import userModel from "../models/user.model.js";
import {
  checkCompanyExistsByName,
  checkDomainExists,
  checkUserExistsByEmail,
} from "../utils/validators.js";
import { validateCompanyInput } from "../middlewares/validate.md.js";

// CREATE: First-time setup only
const setupCompanyAndAdmin = async (req, res) => {
  try {
    const { companyName, domain, admin } = req.body;

    if (await checkCompanyExistsByName(companyName.toLowerCase())) {
      return res.status(400).json({ error: "Company name already exists" });
    }

    if (await checkDomainExists(domain.toLowerCase())) {
      return res.status(400).json({ error: "Company domain already exists" });
    }

    const { name: adminName, email, password } = admin;
    if (!adminName || !email || !password || !companyName || !domain) {
      return res
        .status(400)
        .json({ error: "All fields are required for setup" });
    }
    if (await checkUserExistsByEmail(email))
      return res.status(400).send("Email is already registered");

    const company = await companyModel.create({ name: companyName, domain });

    const hashedPassword = bcrypt.hashSync(password, 8);
    const newAdmin = await userModel.create({
      name: adminName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "admin",
      companyId: company._id,
    });

    return res.status(201).json({
      message: "Company and admin created successfully",
      company,
      admin: {
        name: newAdmin.name,
        email: newAdmin.email,
      },
    });
  } catch (err) {
    console.error("Error in setupCompanyAndAdmin:", err);
    return res.status(500).json({ error: "Setup failed due to server error" });
  }
};

// GET all companies (SuperAdmin only)if need uncomment it
// const getAllCompanies = async (req, res) => {
//   try {
//     const companies = await companyModel.find({});
//     res.status(200).json(companies);
//   } catch (err) {
//     console.error('Error fetching companies:', err);
//     res.status(500).json({ error: 'Failed to fetch companies' });
//   }
// };

// GET single company by ID
const getCompanyById = async (req, res) => {
  const { id } = req.params;
  const { role: currentUserRole, companyId: currentCompanyId } = req.user;

  try {
    // Only admin can see company
    if (currentUserRole !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    if (id !== currentCompanyId) {
      return res
        .status(403)
        .json({ message: "You cannot see another company" });
    }
    const company = await companyModel.findById(id);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.status(200).json(company);
  } catch (err) {
    console.error("Error fetching company:", err);
    res.status(500).json({ error: "Failed to fetch company" });
  }
};

// UPDATE company
const updateCompany = async (req, res) => {
  const { id } = req.params;
  const { companyName, domain } = req.body;
  const { role: currentUserRole, companyId: currentCompanyId } = req.user;


  try {
    const company = await companyModel.findById(id);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
// Only admin can see company
    if (currentUserRole !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    if (id !== currentCompanyId) {
      return res
        .status(403)
        .json({ message: "You cannot update another company" });
    }
    if (companyName) company.name = companyName;
    if (domain) company.domain = domain;

    await company.save();
    res.status(200).json({ message: "Company updated", company });
  } catch (err) {
    console.error("Error updating company:", err);
    res.status(500).json({ error: "Failed to update company" });
  }
};

// DELETE company
const deleteCompany = async (req, res) => {
  const { id } = req.params;
  const { role: currentUserRole, companyId: currentCompanyId } = req.user;


  try {
    // Only admin can see company
    if (currentUserRole !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    if (id !== currentCompanyId) {
      return res
        .status(403)
        .json({ message: "You cannot delete another company" });
    }
    const company = await companyModel.findById(id);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    await companyModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (err) {
    console.error("Error deleting company:", err);
    res.status(500).json({ error: "Failed to delete company" });
  }
};

export default {
  setupCompanyAndAdmin,
  // getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
