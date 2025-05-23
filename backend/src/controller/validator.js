import Joi from "joi";

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": `"Email" must be a valid email`,
    "any.required": `"Email" is a required field`,
  }),
  password: Joi.string().min(8).max(32).required().messages({
    "string.min": `"Password" should have a minimum length of {#limit}`,
    "string.max": `"Password" should have a maximum length of {#limit}`,
    "any.required": `"Password" is a required field`,
  }),
  role: Joi.string().valid("user", "admin").default("user").messages({
    "string.base": `"Role" should be a type of 'text'`,
    "any.only": `"Role" must be one of: user, admin`,
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(32).required(),
});

export const taskValidationSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.base": `"Title" should be a type of 'text'`,
    "any.required": `"Title" is a required field`,
  }),
  description: Joi.string().required().messages({
    "string.base": `"Description" should be a type of 'text'`,
    "any.required": `"Description" is a required field`,
  }),
  status: Joi.string()
    .valid("pending", "in progress", "completed")
    .default("pending")
    .messages({
      "string.base": `"Status" should be a type of 'text'`,
      "any.only": `"Status" must be one of: pending, in progress, completed`,
    }),
  priority: Joi.string()
    .valid("low", "medium", "high")
    .default("medium")
    .messages({
      "string.base": `"Priority" should be a type of 'text'`,
      "any.only": `"Priority" must be one of: low, medium, high`,
    }),
  dueDate: Joi.date().required().messages({
    "date.base": `"Due Date" should be a valid date`,
    "any.required": `"Due Date" is a required field`,
  }),
  assignedTo: Joi.string().messages({
    "string.base": `"Assigned To" should be a valid user ID`,
  }),
  documents: Joi.array()
    .items(
      Joi.object({
        fileName: Joi.string().required(),
        fileUrl: Joi.string().required(),
      })
    )
    .default([]),
});
