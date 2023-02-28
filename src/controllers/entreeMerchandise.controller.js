import entreeMerchandiseModel from "../models/entreeMerchandise.model.js";
import { validationResult } from "express-validator";
import { round } from "mathjs";
import moment from "moment-timezone";
import { findIdsMarchandiseByUser } from "../service/merchandise.service.js";

export const create = async (req, res, next) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) return next(err.errors);

    let { merchandise, entree } = req.body;
    const { price, priceUnit, count } = entree;
    const month = moment().startOf("month").format();
    const existe = await entreeMerchandiseModel.findOne({ merchandise, month });
    let newEntree;
    if (priceUnit) {
      newEntree = {
        priceUnit: price,
        priceTotale: round(price * count, 3),
        count,
      };
    } else {
      newEntree = {
        priceUnit: round(price / count, 3),
        priceTotale: price,
        count,
      };
    }

    let data;
    if (!existe) {
      const object = { merchandise, month, entree: newEntree };
      data = await entreeMerchandiseModel.create(object);
    } else {
      existe.entree.push(newEntree);
      data = await existe.save();
    }
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

    const { price, priceUnit, count, _id } = req.body;
    const existe = await entreeMerchandiseModel.findById(id);
    if (!existe) throw new Error("Merchandise not found");
    let priceUnit_, priceTotale;
    if (priceUnit) {
      priceUnit_ = price;
      priceTotale = round(price * count, 3);
    } else {
      priceUnit_ = round(price / count, 3);
      priceTotale = price;
    }
    const data = await entreeMerchandiseModel.findOneAndUpdate(
      { _id: id, "entree._id": _id },
      {
        $set: {
          "entree.$.count": count,
          "entree.$.priceTotale": priceTotale,
          "entree.$.priceUnit": priceUnit_,
        },
      },
      { new: true }
    );
    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

export const findAll = async (req, res, next) => {
  try {
    const { user } = req;
    const merchandises = await findIdsMarchandiseByUser({ user });
    const data = await entreeMerchandiseModel.find({
      merchandise: { $in: merchandises },
    });
    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    return next(error.message);
  }
};

export const findByMerchandise = async (req, res, next) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) return next(err.errors);

    const { id: merchandise } = req.params;
    const data = await entreeMerchandiseModel.find({ merchandise });
    res.status(200).json({ data });
  } catch (error) {
    return next(error);
  }
};

export const findById = async (req, res, next) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) return next(err.errors);

    const { id } = req.params;
    const data = await entreeMerchandiseModel.findById(id);
    res.status(200).json({ data });
  } catch (error) {
    return next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) return next(err.errors);
    const { id, entreeId } = req.params;
    let data = await entreeMerchandiseModel.findById(id);
    data.entree.pull({ _id: entreeId });
    data = await data.save();
    res.status(200).json({ data });
  } catch (error) {
    return next(error);
  }
};
