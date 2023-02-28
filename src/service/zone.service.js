import employerModel from "#models/employer.model.js";
import zoneModel from "#models/zone.model.js";

import { findIdsBrancheByUser } from "./branche.service.js";

export const zoneUser = async (id, user) => {
  const branches = await findIdsBrancheByUser({ user });
  const zone = await zoneModel.findOne({ _id: id, branche: { $in: branches } });
  if (!zone) return false;
  return true;
};

export const deleteZoneNotExite = async (zones, id) => {
  try {
    const zonesExiste = zones.filter((item) => item._id);
    await zoneModel.deleteMany({
      _id: { $nin: zonesExiste },
      branche: id,
    });
  } catch (error) {}
};

export const createNewZone = async (zones, id) => {
  try {
    const zonesNew = zones.filter((item) => !item._id);
    console.log(zonesNew);
    for await (let zone of zonesNew) {
      await zoneModel.create({ label: zone.label, branche: id });
    }
  } catch (error) {}
};

export const updateNewZone = async (zones) => {
  try {
    const zonesNew = zones.filter((item) => item._id);
    console.log(zonesNew);
    for await (let zone of zonesNew) {
      await zoneModel.findByIdAndUpdate(
        { _id: zone._id },
        { label: zone.label }
      );
    }
  } catch (error) {}
};
