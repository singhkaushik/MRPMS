import Joi from "joi";

const taskFilterSchema = Joi.object({
  status: Joi.string().valid("pending", "in-progress", "completed").optional(),
  assignedTo: Joi.string().hex().length(24).optional(),
  projectId: Joi.string().hex().length(24).optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
});

export const validateTaskFilter = (req, res, next) => {
  const { error } = taskFilterSchema.validate(req.query);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
