import model from "../models/zone.model.js";

import { findIdsBrancheByUser } from "./branche.service.js";

export const createZone = async ({ label, branche }) => {
  return await model.create({ label, branche });
};

export const findZone = async (query) => {
  return await model.find(query);
};

export const deleteManyZone = async (query) => {
  return await model.deleteMany(query);
};

export const zoneUser = async (id, user) => {
  const branches = await findIdsBrancheByUser({ user });
  const zone = await model.findOne({ _id: id, branche: { $in: branches } });
  if (!zone) return false;
  return true;
};

export const deleteZoneNotExite = async (zones, branche) => {
  const zonesExiste = zones.filter((item) => item._id);
  await model.deleteMany({
    _id: { $nin: zonesExiste },
    branche,
  });
};

export const createNewZone = async (zones, branche) => {
  const zonesNew = zones.filter((item) => !item._id);
  console.log(zonesNew);
  for await (let { label } of zonesNew) {
    await model.create({ label, branche });
  }
};

export const updateNewZone = async (zones) => {
  const zonesNew = zones.filter((item) => item._id);
  console.log(zonesNew);
  for await (let { _id, label } of zonesNew) {
    await model.findByIdAndUpdate({ _id }, { label });
  }
};
export const createByArray = async (zones, branche) => {
  let data = [];
  for await (let { label } of zones) {
    const zoneCreation = await createZone({ label, branche });
    data.push(zoneCreation);
  }
  return data;
};
