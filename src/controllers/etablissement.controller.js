import { validationResult } from "express-validator";

//* import from models
import etablissementModel from "#models/etablissement.model.js";

//* contoller

export const update = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) return next(err.errors);

  try {
    const { user } = req;
    const { etablissement } = user;
    const data = await etablissementModel.findByIdAndUpdate(
      etablissement,
      req.body,
      {
        new: true,
      }
    );
    return res.status(200).json({
      message: "Etablissement update successfully",
      data,
    });
  } catch (error) {
    next(error.message);
  }
};

export const find = async (req, res, next) => {
  try {
    const { user } = req;
    const { etablissement } = user;
    const data = await etablissementModel.findById(etablissement);
    if (!data) return next("etablissement not found");
    return res.status(200).json({
      message: "Etablissement find successfully",
      data,
    });
  } catch (error) {
    next(error.message);
  }
};
