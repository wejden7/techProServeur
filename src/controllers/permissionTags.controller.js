import permissionTagsModel from "#models/permissionTags.model.js";

import { validationResult } from "express-validator";


export const create = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) return next(err.errors);

  try {
    const permission = await permissionTagsModel.create(req.body);

    return res.status(200).json({
        message: "permission created successfully",
        data: permission,
      });
  } catch (error) {
    next(error.message);
  }
};

export const find = async (req, res, next) => {
  try {
    const permission = await permissionTagsModel.find();

    return res.status(200).json({
        message: "permission find successfully",
        data: permission,
      });
  } catch (error) {
    next(error.message);
  }
}
