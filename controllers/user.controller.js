import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";
import { isValidObjectId, checkCompanyExists, checkUserExistsByEmail } from "../utils/validators.js";
import { validateUserInput, validateSignInput } from "../middlewares/validate.md.js";
import { generateToken, generateRefreshToken } from "../utils/jwtToken.js";

// CREATE (Admin only)
const userSignup = async (req, res) => {
  const { name, email, password, role, companyID } = req.body;
  const { role: currentUserRole, companyId: currentCompanyId } = req.user;
  

  // Only admin can create users
  if (currentUserRole !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  if (companyID !== currentCompanyId) {
    return res.status(403).json({ message: "You cannot create users for another company" });
  }

  const { isValid, errorMessage } = validateUserInput({ name, email, password, companyID });
  if (!isValid) return res.status(400).json({ error: errorMessage });

  try {
    if (await checkUserExistsByEmail(email)) return res.status(400).send("Email is already registered");

    const hashedPassword = bcrypt.hashSync(password, 8);

    const newUser = await userModel.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      companyId: companyID,
    });

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    res.status(500).send("Error creating user");
  console.log(err);

  }
};

// READ (Admins/Managers: list users in their company)
const getUsers = async (req, res) => {
  const { role, companyId } = req.user;
  if (role !== "admin" && role !== "manager") return res.status(403).send("Access denied");

  const users = await userModel.find({ companyId }, "-password");
  res.status(200).json(users);
};

// UPDATE (Admin can update any user, Member can update self)
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, password } = req.body;
  const { role, _id: userId, companyId } = req.user;

  if (!isValidObjectId(id)) return res.status(400).send("Invalid user ID");

  const user = await userModel.findById(id);
  if (!user || user.companyId.toString() !== companyId.toString()) {
    return res.status(404).send("User not found in your company");
  }

  if (role !== "admin" && user._id.toString() !== userId.toString()) {
    return res.status(403).send("Access denied");
  }

  if (name) user.name = name;
  if (password) user.password = bcrypt.hashSync(password, 8);

  await user.save();
  res.status(200).json({ message: "User updated", user });
};

// DELETE (Admins only)
const deleteUser = async (req, res) => {
  const { id } = req.params;
  const { role, companyId } = req.user;

  if (role !== "admin") return res.status(403).send("Access denied");

  const user = await userModel.findById(id);
  if (!user || user.companyId.toString() !== companyId.toString()) {
    return res.status(404).send("User not found in your company");
  }

  await userModel.findByIdAndDelete(id);
  res.status(200).json({ message: "User deleted" });
};

// LOGIN
const userSignIn = async (req, res) => {
  const { email, password } = req.body;
  const { isValid, errorMessage } = validateSignInput({ email, password });

  if (!isValid) return res.status(400).json({ error: errorMessage });

  const user = await userModel.findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(400).send("Invalid credentials");
  }

  const token = generateToken({ id: user._id, email: user.email, role: user.role, companyId: user.companyId });
  const refreshToken = generateRefreshToken({ id: user._id });

  res.status(200).json({
    message: "Login successful",
    token,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    },
  });
};

export default {
  userSignup,
  userSignIn,
  getUsers,
  updateUser,
  deleteUser,
};
