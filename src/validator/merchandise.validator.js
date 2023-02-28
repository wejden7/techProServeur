import { body } from "express-validator";

export const create = [
  body("label").notEmpty().withMessage("Label is required"),
  body("unit").notEmpty().withMessage("Unit is required"),
];
export const update = [
  body("label").notEmpty().withMessage("Label is required"),
  body("unit").notEmpty().withMessage("Unit is required"),
];
