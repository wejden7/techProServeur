import etablissementModel from "#models/etablissement.model.js";
import brancheModel from "#models/branche.model.js";
import zoneModel from "#models/zone.model.js";
import parametresModel from "#models/parametres.model.js";
import { findEmployer } from "./employer.service.js";

export const etablissementByEmployer = async ({ id }) => {
  const { etablissement } = await findEmployer(id);
  return etablissement;
};

export const createDefaultEtablissement = async () => {
  const etablissement = await etablissementModel.create({
    label: "restaurant",
  });
  const branche = await brancheModel.create({
    label: "restaurant 1",
    etablissement: etablissement._id,
  });
  const zone = await zoneModel.create({
    label: "zone1",
    branche: branche._id,
  });
  const parametre = await parametresModel.create({
    etablissement: etablissement._id,
  });
  return etablissement;
};

export const findParameterByEtablissement = async ({ _id }) => {
  return await parametresModel.findOne({ etablissement: _id });
};
