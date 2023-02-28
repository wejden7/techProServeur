import merchandiseModel from "../models/merchandise.model.js";
import { brancheUser, findBrancheByUser } from "../service/branche.service.js";
import { validationResult } from "express-validator";

export const create = async (req, res, next) => {
  try {
    console.log("create", req.body);
    const err = validationResult(req);
    if (!err.isEmpty()) return next(err.errors);

    const { user } = req;
    const { label, unit } = req.body;
    const branche = await findBrancheByUser({ user });
    if (branche.length === 0) throw new Error("Branche not found");

    const data = await merchandiseModel.create({
      label,
      unit,
      branche: branche[0]._id,
    });

    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    return next(error.message);
  }
};

export const update = async (req, res, next) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) return next(err.errors);

    const { id } = req.params;
    const { label, unit } = req.body;

    

    const data = await merchandiseModel.findByIdAndUpdate(
      id,
      { label, unit },
      { new: true, runValidators: true }
    );
    if (!data) throw new Error("Merchandise not found");

    res.status(200).json({ data });
  } catch (error) {
    return next(error.message);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existe = await merchandiseModel.findById(id);
    if (!existe) throw new Error("Merchandise not found");
    const data = await merchandiseModel.findByIdAndDelete(id);
    res.status(200).json({ message: `${data.label} deleted successfully` });
  } catch (error) {
    return next(error.message);
  }
};

export const findById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await merchandiseModel.findById(id);
    if (!data) throw new Error("Merchandise not found");

    res.status(200).json({ data });
  } catch (error) {
    return next(error.message);
  }
};

export const findAll = async (req, res, next) => {
  try {
    const { user } = req;
    const branches = await findBrancheByUser({ user });

    const data = await merchandiseModel.find({
      branche: { $in: branches },
    });

    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    return next(error.message);
  }
};
