export const validateCompanyInput = ({ companyName, domain }) => {
  const errors = [];

  if (!companyName) errors.push("Name is required");
  if (!domain) errors.push("Domain is required");

  return errors.length > 0
    ? { isValid: false, errorMessage: errors.join(", ") }
    : { isValid: true, errorMessage: null };
};

export const validateProjectInput = ({
  name,
  description,
  createdBy,
  companyId,
}) => {
  const errors = [];

  if (!name) errors.push("Project name is required");
  if (!description) errors.push("Description is required");
  if (!createdBy) errors.push("CreatedBy is required");
  if (!companyId) errors.push("Company ID is required");

  return errors.length > 0
    ? { isValid: false, errorMessage: errors.join(", ") }
    : { isValid: true, errorMessage: null };
};
export const validateTaskInput = ({
  title,
  description,
  assignedTo,
  projectId,
}) => {
  const errors = [];

  if (!title) errors.push("Title name is required");
  if (!description) errors.push("Description is required");
  if (!assignedTo) errors.push("AssignedTo is required");
  if (!projectId) errors.push("ProjectId ID is required");

  return errors.length > 0
    ? { isValid: false, errorMessage: errors.join(", ") }
    : { isValid: true, errorMessage: null };
};
export const validateUserInput = ({ name, email, password, companyID }) => {
  const errors = [];

  if (!name) errors.push("Name is required");
  if (!email) {
    errors.push("Email is required");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("Invalid email format");
    }
  }
  if (!password) errors.push("Password is required");
  if (!companyID) errors.push("CompanyID ID is required");

  return errors.length > 0
    ? { isValid: false, errorMessage: errors.join(", ") }
    : { isValid: true, errorMessage: null };
};
export const validateSignInput = ({email, password}) => {
  const errors = [];

  if (!email) {
    errors.push("Email is required");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("Invalid email format");
    }
  }
  if (!password) errors.push("Password is required"); 
  
  return errors.length > 0
    ? { isValid: false, errorMessage: errors.join(", ") }
    : { isValid: true, errorMessage: null }; 
}
