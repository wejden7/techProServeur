import demondMerchandiseModel from "../models/demondMerchandise.model.js";

import { validationResult } from "express-validator";
import { findIdsEmployerByUser } from "../service/employer.service.js";

export const create = async (req, res, next) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) return next(err.errors);

    const { _id, role } = req.user;
    const { list } = req.body;

    // if (role === "admin") throw new Error("Admin not authorized");
    // 63ce662bb91f01566cee5b3c

    const data = await demondMerchandiseModel.create({
      employer: "63ce662bb91f01566cee5b3c",
      list,
    });
    return res.status(200).json({ data });
  } catch (error) {
    return next(error.message);
  }
};

export const update = async (req, res, next) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) return next(err.errors);
    const { id } = req.params;
    const { list } = req.body;
    const data = await demondMerchandiseModel.findByIdAndUpdate(
      id,
      { list },
      { new: true, runValidators: true }
    );
    return res.status(200).json({ data });
  } catch (error) {
    return next(error.message);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await demondMerchandiseModel.findByIdAndDelete(id);
    if (!data) throw new Error("demonde not found");
    return res.status(200).json({ data });
  } catch (error) {
    return next(error.message);
  }
};

export const find = async (req, res, next) => {
  try {
    const { user } = req;
    const employer = await findIdsEmployerByUser({user});
    const query = { employer: { $in: employer } };
    const data = await demondMerchandiseModel.find(query);
    return res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    return next(error.message);
  }
};
