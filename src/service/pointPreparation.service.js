
import model from "../models/pointPreparation.model.js";

import { findIdsBrancheByUser } from "./branche.service.js";

export const createPoint = async ({ label, branche }) => {
  return await model.create({ label, branche });
};

export const findPoint = async (query) => {
  return await model.find(query);
};

export const deleteManyPoint = async (query) => {
  return await model.deleteMany(query);
};

export const deletePointNotExiste = async (points, branche) => {
  const pointsExiste = points.filter((item) => item._id);
  await model.deleteMany({
    _id: { $nin: pointsExiste },
    branche,
  });
};

export const createNewPoint = async (points, branche) => {
  const pointsNew = points.filter((item) => !item._id);
  for await (let { label } of pointsNew) {
    await model.create({ label, branche });
  }
};

export const updatePoint = async (points) => {
  const pointsExiste = points.filter((item) => item._id);
  for await (let { _id, label } of pointsExiste) {
    await model.findByIdAndUpdate({ _id }, { label });
  }
};

export const createByArray = async (points, branche) => {
    let data = [];
    for await (let { label } of points) {
      const pointCreate = await createPoint({ label, branche });
      data.push(pointCreate);
    }
    return data;
  };