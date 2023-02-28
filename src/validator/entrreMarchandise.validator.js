import { body, param } from "express-validator";
import { merchandiseUser } from "../service/merchandise.service.js";
import entreeMerchandiseModel from "../models/entreeMerchandise.model.js";

export const create = [
  body("merchandise").custom(async (id, { req }) => {
    try {
      const { user } = req;
      const valide = await merchandiseUser({ id, user });
      if (!valide) return Promise.reject("mechandise not found");
    } catch (error) {
      return Promise.reject("mechandise not found");
    }
  }),

  body("entree.count")
    .notEmpty()
    .withMessage("Count is required")
    .isDecimal()
    .withMessage("Count is Decimal"),
  body("entree.priceUnit")
    .optional()
    .isBoolean()
    .withMessage("priceUnit is boolean"),

  body("entree.price").optional().isDecimal().withMessage("price is Decimal"),
];

export const findByMerchandise = [
  param("id").custom(async (id, { req }) => {
    try {
      const { user } = req;
      const valide = await merchandiseUser({ id, user });
      if (!valide) return Promise.reject("mechandise not found");
    } catch (error) {
      console.log(error);
      return Promise.reject("mechandise not found");
    }
  }),
];

export const findById = [
  param("id").custom(async (id, { req }) => {
    try {
      const { user } = req;
      const entree = await entreeMerchandiseModel.findById(id);
      const valide = await merchandiseUser({ id: entree?.merchandise, user });
      if (!valide) return Promise.reject("mechandise not found");
    } catch (error) {
      console.log(error);
      return Promise.reject("mechandise not found");
    }
  }),
];

export const update = [
  param("id").custom(async (id, { req }) => {
    try {
      const { user } = req;
      const entree = await entreeMerchandiseModel.findById(id);
      
      const valide = await merchandiseUser({ id: entree.merchandise, user });
      if (!valide) return Promise.reject("mechandise not found");
    } catch (error) {
      console.log(error);
      return Promise.reject("mechandise not found");
    }
  }),

  body("count")
    .notEmpty()
    .withMessage("Count is required")
    .isDecimal()
    .withMessage("Count is Decimal"),
  body("priceUnit").optional().isBoolean().withMessage("priceUnit is boolean"),

  body("price").optional().isDecimal().withMessage("price is Decimal"),
];

export const remove = [
  param("id").custom(async (id, { req }) => {
    try {
      const { user } = req;
      const entree = await entreeMerchandiseModel.findById(id);
      const valide = await merchandiseUser({ id: entree.merchandise, user });
      if (!valide) return Promise.reject("entree mechandise not found");
    } catch (error) {
      console.log(error);
      return Promise.reject("mechandise not found");
    }
  }),
  param("entreeId").custom(async (entreeId, { req }) => {
    try {
      const { id } = req.params;
      const entree = await entreeMerchandiseModel.findOne({
        id: id,
        entree: { $elemMatch: { _id: entreeId } },
      });

      if (!entree) return Promise.reject("entreeMechandise not found");
    } catch (error) {
      return Promise.reject("entreeMechandise not found");
    }
  }),
];
