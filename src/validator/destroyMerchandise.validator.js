import { body, param } from "express-validator";
import { merchandiseUser } from "../service/merchandise.service.js";
import destroyMerchandiseModel from "../models/destroyMerchandise.model.js";

export const create = [
  param("id").custom(async (id, { req }) => {
    try {
      const { user } = req;
      const valide = await merchandiseUser({ id, user });
      if (!valide) return Promise.reject("mechandise not found");
    } catch (error) {
      return Promise.reject("mechandise not found");
    }
  }),

  body("count")
    .notEmpty()
    .withMessage("Count is required")
    .isDecimal()
    .withMessage("Count is Decimal"),
];

export const remove = [
  param("id").custom(async (id, { req }) => {
    try {
      const { user } = req;
      const destroy = await destroyMerchandiseModel.findById(id);
      const valide = await merchandiseUser({ id: destroy.merchandise, user });
      if (!valide) return Promise.reject("destroy mechandise not found");
    } catch (error) {
      console.log(error);
      return Promise.reject("mechandise not found");
    }
  }),
  param("destroyId").custom(async (destroyId, { req }) => {
    try {
      const { id } = req.params;
      const destroy = await destroyMerchandiseModel.findOne({
        id: id,
        destroy: { $elemMatch: { _id: destroyId } },
      });

      if (!destroy) return Promise.reject("Destroy item Merchandise not found");
    } catch (error) {
      return Promise.reject("entreeMechandise not found");
    }
  }),
];

export const update =[
  param("id").custom(async (id, { req }) => {
    try {
      const { user } = req;
      const destroy = await destroyMerchandiseModel.findById(id);
      const valide = await merchandiseUser({ id: destroy.merchandise, user });
      if (!valide) return Promise.reject("destroy mechandise not found");
    } catch (error) {
      console.log(error);
      return Promise.reject("mechandise not found");
    }
  }),
  body("_id").custom(async (destroyId, { req }) => {
    try {
      const { id } = req.params;
      const destroy = await destroyMerchandiseModel.findOne({
        id: id,
        destroy: { $elemMatch: { _id: destroyId } },
      });

      if (!destroy) return Promise.reject("Destroy item Merchandise not found");
    } catch (error) {
      return Promise.reject("entreeMechandise not found");
    }
  }),
  body("count")
  .notEmpty()
  .withMessage("Count is required")
  .isDecimal()
  .withMessage("Count is Decimal"),
]