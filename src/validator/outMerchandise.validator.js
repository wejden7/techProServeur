import { demondByUser } from "../service/demondeMerchandise.service.js";
import { merchandiseUser } from "../service/merchandise.service.js";
import mongoose from "mongoose";
import outMerchandiseModel from "../models/outMerchandise.model.js";

const valideMerchandise = async ({ merchandise, error, user }) => {
  if (!merchandise) {
    error.push({ err: ` merchandise is required` });
  } else {
    if (!mongoose.isValidObjectId(merchandise))
      error.push({ err: ` merchandise not  valide` });
    else {
      const valide = await merchandiseUser({ id: merchandise, user });
      if (!valide) error.push({ err: ` merchandise not found` });
    }
  }

  return error;
};
const validCount = ({ count, error }) => {
  if (!count) error.push({ err: ` out count is required` });
  else if (isNaN(count)) error.push({ err: `out count is decimale` });
  return error;
};
const validDemond = async ({ demond, error, user }) => {
  if (!demond) error.push({ err: `out demond is required` });
  else {
    if (!mongoose.isValidObjectId(demond))
      error.push({ err: ` demond not  valide` });
    else {
      const valide = await demondByUser({ id: demond, user });
      if (!valide) error.push({ err: `out demond not found` });
    }
  }

  return error;
};
const validOut = async ({ out, error, user }) => {
  if (!out) error.push({ err: `out  id is required` });
  else {
    if (!mongoose.isValidObjectId(out))
      error.push({ err: ` out  id not  valide` });
    else {
      const valide = await outMerchandiseModel.findById(out);
      if (!valide) error.push({ err: "out id not found" });
      else {
        const { merchandise } = valide;
        error = await valideMerchandise({ merchandise, error, user });
      }
    }
  }
  return error;
};

const validOutItem = async ({ id, error }) => {
  if (!id) error.push({ err: "id is required" });
  else if (!mongoose.isValidObjectId(id))
    error.push({ err: "id is not a valid" });
  else {
    const outitem = await outMerchandiseModel.findOne({
      out: { $elemMatch: { _id: id } },
    });
    if (!outitem) error.push({ err: "out item not found" });
  }
  return error;
};

export const create = async (req, res, next) => {
  try {
    var error = [];
    const { user } = req;
    const { merchandise, out } = req.body;
    error = await valideMerchandise({ merchandise, error, user });

    if (!out) error.push({ err: "out is required" });
    else {
      error = validCount({ count: out.count, error });
      error = await validDemond({ demond: out.demond, error, user });
    }

    if (error.length > 0) throw error;
    next();
  } catch (error) {
    return next(error);
  }
};

export const findByMerchandise = async (req, res, next) => {
  try {
    var error = [];
    const { id } = req.params;
    const { user } = req;
    error = await valideMerchandise({ merchandise: id, error, user });
    if (error.length > 0) throw error;
    next();
  } catch (error) {
    return next(error);
  }
};

export const findById = async (req, res, next) => {
  try {
    var error = [];
    const { id } = req.params;
    const { user } = req;
    error = await validOut({ out: id, error, user });
    if (error.length > 0) throw error;
    next();
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    var error = [];
    const { user } = req;
    const { id } = req.params;
    const { out } = req.body;
    error = await validOut({ out: id, error, user });
    if (!out) error.push({ err: "out is required" });
    else {
      error = validCount({ count: out.count, error });
      error = await validDemond({ demond: out.demond, error, user });
      error = await validOutItem({ id: out._id, error });
    }
    if (error.length > 0) throw error;
    next();
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    var error = [];
    const { id, outId } = req.params;
    const { user } = req;
    error = await validOut({ out: id, error, user });
    error = await validOutItem({ id: outId, error });

    if (error.length > 0) throw error;
    next();
  } catch (error) {
    return next(error);
  }
};
