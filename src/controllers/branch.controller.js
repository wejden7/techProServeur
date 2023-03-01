import { validationResult } from "express-validator";
import model from "../models/branche.model.js";
import { findBrancheByUser } from "../service/branche.service.js";

import * as zoneService from "../service/zone.service.js";

import * as pointService from "../service/pointPreparation.service.js";

export const create = async (req, res, next) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) return next(err.errors);

    let { label, adresse, tel, zones, pointPreparation } = req.body;
    const { etablissement } = req.user;
    const query = { label, adresse, tel, etablissement };
    const branche = await model.create(query);
    const { _id } = branche;
    zones = await zoneService.createByArray(zones, _id);
    pointPreparation = await pointService.createByArray(pointPreparation, _id);
    const resualt = {
      message: "Branche created successfully",
      data: { ...branche.toObject(), zones, pointPreparation },
    };
    return res.status(200).json(resualt);
  } catch (error) {
    next(error.message);
  }
};

export const update = async (req, res, next) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) return next(err.errors);

    const { id } = req.params;
    let { label, zones, pointPreparation, adresse, tel } = req.body;

    const queryUpdate = { label, adresse, tel };
    const option = { new: true };
    const branche = await model.findByIdAndUpdate(id, queryUpdate, option);

    if (!branche) return next("branche not found");

    await zoneService.deleteZoneNotExite(zones, id);
    await zoneService.createNewZone(zones, id);
    await zoneService.updateNewZone(zones);
    await pointService.deletePointNotExiste(pointPreparation, id);
    await pointService.createNewPoint(pointPreparation, id);
    await pointService.updatePoint(pointPreparation);
    const { _id } = branche;
    const queryFind = { branche: _id };
    zones = await zoneService.findZone(queryFind);
    pointPreparation = await pointService.findPoint(queryFind);

    return res.status(200).json({
      message: "Branche update successfully",
      data: { ...branche.toObject(), zones, pointPreparation },
    });
  } catch (error) {
    return next(error.message);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const branche = await model.findByIdAndDelete(id);
    if (!branche) return next("branche not found");

    const query = { branche: branche._id };
    await zoneService.deleteManyZone(query);
    await pointService.deleteManyPoint(query);

    return res.status(200).json({
      message: "Branche deleted successfully",
      data: id,
    });
  } catch (error) {
    return next(error.message);
  }
};

export const findById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const branche = await model.findById(id).populate("etablissement");
    if (!branche) return next("branche not found");
    return res.status(200).json({
      message: "Branche find successfully",
      data: branche,
    });
  } catch (error) {
    return next(error.message);
  }
};

export const findByEtablissement = async (req, res, next) => {
  const { user } = req;
  try {
    const branches = await findBrancheByUser({ user });
    if (branches.length === 0) return next("branche not found");
    let resualt = [];

    for await (let branche of branches) {
      const query = { branche: branche._id };
      const pointPreparation = await pointService.findPoint(query);
      const zones = await zoneService.findZone(query);
      const newObject = { ...branche.toObject(), zones, pointPreparation };
      resualt.push(newObject);
    }
    return res.status(200).json({
      message: "Branche find successfully",
      data: resualt,
    });
  } catch (error) {
    return next(error.message);
  }
};
