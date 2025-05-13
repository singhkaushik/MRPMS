import mongoose from "mongoose"

// Company Schema
const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    domain: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
  },
  {
    timestamps: true, 
  }
);

// Create Company model
const Company = mongoose.model("Company", companySchema);
export default Company;
