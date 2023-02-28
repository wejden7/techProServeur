import employerModel from "#models/employer.model.js";

import { findParameterByEtablissement } from "./etablissement.service.js";
import { CalculeTauxHorer } from "../helpers/service.js";
import { findIdsBrancheByUser } from "./branche.service.js";

export const findEmployer = async (id) => {
  try {
    const populateArray = [
      "post",
      { path: "branche", populate: { path: "etablissement" } },
    ];
    const employer = await employerModel.findById(id).populate(populateArray);
    const { post, branche, ...otherEmpyer } = employer.toObject();
    const { etablissement, ...otherBrenche } = branche;
    return {
      post,
      branche: otherBrenche,
      employer: otherEmpyer,
      etablissement,
    };
  } catch (error) {
    throw new Error("error in findEmployer");
  }
};

export const employerUser = async (id, user) => {
  const employers = await findEmployerByUser({ user });
  const employer = await employers.find((item) => item._id.equals(id));
  if (!employer) return false;
  return true;
};

export const findEmployerByUser = async ({ user }) => {
  const { _id, role } = user;
  switch (role) {
    case "admin":
      const branches = await findIdsBrancheByUser({ user });
      const query = { branche: { $in: branches } };
      return await employerModel.find(query);
    default:
      const { branche } = await employerModel.findById(_id);
      return await employerModel.find({ branche: branche });
  }
};
export const findIdsEmployerByUser = async ({ user }) => {
  let employers = await findEmployerByUser({ user });
  employers = employers.map((item) => item._id);
  return employers;
};
export const findIdsEmployer = async () => {
  let employer = await employerModel.find();
  employer = employer.map((item) => item._id);
  return employer;
};
export const initEmployer = async ({ id }) => {
  const { post, branche, employer, etablissement } = await findEmployer(id);

  const parametre = await findParameterByEtablissement(etablissement);
  const { salaryBase, WorkHoursPerWeek } = employer;
  const tauxHorer = CalculeTauxHorer(salaryBase, WorkHoursPerWeek);
  return { post, branche, employer, etablissement, parametre, tauxHorer };
};
