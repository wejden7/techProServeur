import merchandiseModel from "../models/merchandise.model.js";
import { brancheUser } from "./branche.service.js";
import * as demond from "./demondeMerchandise.service.js";
import * as entree from "./entreeMerchandise.service.js";
import { findBrancheByUser } from "./branche.service.js";

export const merchandiseUser = async ({ id, user }) => {
  const { branche } = (await merchandiseModel.findById(id)) || {};
  if (!branche) return false;
  const data = await brancheUser(branche, user);
  if (!data) return false;
  return true;
};

export const findMerchandiseByUser = async ({ user }) => {
  const branches = await findBrancheByUser({ user });

  const data = await merchandiseModel.find({
    branche: { $in: branches },
  });

  return data;
};
export const findIdsMarchandiseByUser = async ({ user }) => {
  let marchandise = await findMerchandiseByUser({ user });
  marchandise = marchandise.map((item) => item._id);
  return marchandise;
};

//* Middleware for model
export async function preFindOneAndDelete(next) {
  try {
    const { _id } = this._conditions;
    await entree.deletebyMerchandise({ merchandise: _id });
    await demond.deleteByMerchandise({ merchandise: _id });
    // return next();
  } catch (error) {
    return next(error);
  }
}
