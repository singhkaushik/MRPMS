import mongoose from "mongoose"
import companyModel from "../models/company.model.js"
import userModel from "../models/user.model.js"
import projectModel from "../models/project.model.js"

export const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const checkCompanyExistsByName = async (name) => {
  const company = await companyModel.findOne({ name });
  return !!company;
};
export const checkDomainExists = async (domain) => {
  const domainName = await companyModel.findOne({ domain });
  return !!domainName;
};

export const checkCompanyExists = async (companyId) => {
  if (!isValidObjectId(companyId)) return false;
  const company = await companyModel.findById(companyId);
  return !!company;
};


export const checkUserExists = async (userId) => {
  if (!isValidObjectId(userId)) return false;
  const user = await userModel.findById(userId);
  return !!user;
};

export const checkProjectExists = async (projectId) => {
  if (!isValidObjectId(projectId)) return false;
  const project = await projectModel.findById(projectId);
  return !!project;
};
export const checkUserExistsByEmail = async (email) => {
  const user = await userModel.findOne({ email });
  return !!user;
};
