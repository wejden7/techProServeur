import model from "../models/destroyMerchandise.model.js";
import moment from "moment-timezone";
import { validationResult } from "express-validator";
import { findIdsMarchandiseByUser } from "../service/merchandise.service.js";
import {
  createNew,
  addDestroy,
} from "../service/destroyMerchandise.service.js";

export const create = async (req, res, next) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) return next(err.errors);

    const { count, comment } = req.body;
    const { id: merchandise } = req.params;
    const month = moment().startOf("month").format();
    const queryFind = { merchandise, month };
    const existe = await model.findOne(queryFind);
    const destroy = { count, comment };
    const NewDestroy = { merchandise, month, destroy };
    const data = !existe
      ? await createNew(NewDestroy)
      : await addDestroy(existe, destroy);
    return res.status(200).json({ data });
  } catch (error) {
    return next(error);
  }
};

export const findAll = async (req, res, next) => {
  try {
    const { user } = req;
    const merchandises = await findIdsMarchandiseByUser({ user });
    const queryFind = { merchandise: { $in: merchandises } };
    const data = await model.find(queryFind);
    res.status(200).json({ data });
  } catch (error) {
    return next(error.message);
  }
};

export const remove = async (req, res, next) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) return next(err.errors);

    const { id, destroyId } = req.params;
    let data = await model.findById(id);
    data.destroy.pull({ _id: destroyId });
    data = await data.save();
    res.status(200).json({ data });
  } catch (error) {
    return next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) return next(err.errors);

    const { id } = req.params;
    const { comment, count, _id } = req.body;
    const filterQuery = { _id: id, "destroy._id": _id };
    const updateQuery = {
      $set: {
        "destroy.$.count": count,
        "destroy.$.comment": comment,
      },
    };
    const option = { new: true };
    const data = await model.findOneAndUpdate(filterQuery, updateQuery, option);
    res.status(200).json({ data });
  } catch (error) {
    return next(error);
  }
};
