import { validationResult } from "express-validator";

//* import from helpers
import {
  deleteZoneNotExite,
  createNewZone,
  updateNewZone,
} from "#service/zone.service.js";

//* import from models
import brancheModel from "#models/branche.model.js";
import zoneModel from "#models/zone.model.js";
import { findBrancheByUser } from "../service/branche.service.js";

// add service add le zonne en meme tent
export const create = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) return next(err.errors);

  const { label, adresse, tel, zones } = req.body;

  try {
    const { etablissement } = req.user;

    const branche = await brancheModel.create({
      label: label,
      adresse,
      tel,
      etablissement,
    });

    let zonesResualt = [];
    for await (let zone of zones) {
      const zoneCreation = await zoneModel.create({
        label: zone.label,
        branche: branche._id,
      });
      zonesResualt.push(zoneCreation);
    }
    const newObject = {
      _id: branche._id,
      label: branche.label,
      zones: zonesResualt,
    };
    return res.status(200).json({
      message: "Branche created successfully",
      data: newObject,
    });
  } catch (error) {
    next(error.message);
  }
};

export const update = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) return next(err.errors);
  const { id } = req.params;
  const { label, zones, adresse, tel } = req.body;
  try {
    const branche = await brancheModel.findByIdAndUpdate(
      id,
      { label, adresse, tel },
      {
        new: true,
      }
    );
    if (!branche) return next("branche not found");

    await deleteZoneNotExite(zones, id);
    await createNewZone(zones, id);
    await updateNewZone(zones);

    const zonesfind = await zoneModel.find({
      branche: branche._id,
    });

    const newObject = {
      _id: branche._id,
      label: branche.label,
      adresse: branche.adresse,
      tel: branche.tel,
      zones: zonesfind,
    };
    return res.status(200).json({
      message: "Branche update successfully",
      data: newObject,
    });
  } catch (error) {
    return next(error.message);
  }
};

export const remove = async (req, res, next) => {
  const { id } = req.params;

  try {
    const branche = await brancheModel.findByIdAndDelete(id);
    if (!branche) return next("branche not found");

    await zoneModel.deleteMany({ branche: branche._id });

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
    const branche = await brancheModel.findById(id).populate("etablissement");
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
      const zones = await zoneModel.find({ branche: branche._id });
      const newObject = {
        _id: branche._id,
        label: branche.label,
        adresse: branche.adresse,
        tel: branche.tel,
        zones: zones,
      };
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
