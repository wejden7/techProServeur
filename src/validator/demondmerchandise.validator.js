import { body, param } from "express-validator";
import demondMerchandiseModel from "../models/demondMerchandise.model.js";

import { merchandiseUser } from "../service/merchandise.service.js";

const valideMerchandise = async ({ merchandise, index, error, user }) => {
  if (!merchandise) {
    error.push({ err: `list.${index} merchandise is required` });
  } else {
    const valide = await merchandiseUser({ merchandise, user });
    if (!valide) error.push({ err: `list.${index} merchandise not found` });
  }
  return error;
};
const validCount = ({ count, index, error }) => {
  if (!count) error.push({ err: `list.${index} count is required` });
  if (isNaN(count)) error.push({ err: `list.${index} count is decimale` });
  return error;
};

export const create_ = async (req, res, next) => {
  try {
    var error = [];
    const { user } = req;
    const { list } = req.body;
    if (!list || list.length === 0) error.push({ err: "list is required" });
    await Promise.all(
      list.map(async ({ count, merchandise }, index) => {
        error = validCount({ count, index, error });
        error = await valideMerchandise({ merchandise, index, error, user });
      })
    );
    if (error.length > 0) throw error;
    return next();
  } catch (error) {
    return next(error);
  }
};
export const create = [
  body("list").notEmpty().withMessage("liste of demonde is required"),
  body("list.*.count")
    .notEmpty()
    .withMessage("cuont is required")
    .isDecimal()
    .withMessage("count is decimals"),
  body("list.*.merchandise").custom(async (id, { req }) => {
    try {
      const { user } = req;
      const valide = await merchandiseUser({ id, user });
      if (!valide) return Promise.reject("mechandise not found");
    } catch (error) {
      return Promise.reject("mechandise not found");
    }
  }),
];

export const update = [
  param("id").custom(async (id, { req }) => {
    try {
      const { _id } = req.user;
      const existe = await demondMerchandiseModel.findById(id);
      if (!existe) return Promise.reject("demond not found");

      /* if (!existe.employer.equals(_id))
        return Promise.reject("set demond not autorizayed");*/
      if (existe.status === "traite")
        return Promise.reject("set demond et Traite");
    } catch (error) {
      return Promise.reject("demond not found");
    }
  }),
  body("list").notEmpty().withMessage("liste of demonde is required"),
  body("list.*.count")
    .notEmpty()
    .withMessage("cuont is required")
    .isDecimal()
    .withMessage("count is decimals"),
  body("list.*.merchandise").custom(async (id, { req }) => {
    try {
      const { user } = req;
      const valide = await merchandiseUser({ id, user });
      if (!valide) return Promise.reject("mechandise not found");
    } catch (error) {
      return Promise.reject("mechandise not found");
    }
  }),
];

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) throw new Error("id is required");
    const demond = await demondMerchandiseModel.findById(id);
    if (!demond) throw new Error("demond not found");
    next();
  } catch (error) {
    return next(error.message);
  }
};
