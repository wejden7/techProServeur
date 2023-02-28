import demondMerchandiseModel from "../models/demondMerchandise.model.js";
import { findIdsEmployerByUser } from "./employer.service.js";

export const deleteByMerchandise = async ({ merchandise }) => {
  await demondMerchandiseModel.deleteMany({
    list: { $elemMatch: { merchandise } },
  });
};

export const demondByUser = async ({ id, user }) => {
  const employers = await findIdsEmployerByUser({ user });

  const demond = await demondMerchandiseModel.findOne({
    _id: id,
    employer: { $in: employers },
  });
  if (!demond) return false;
  return true;
};
