import employerModel from "#models/employer.model.js";
import brancheModel from "#models/branche.model.js";

export const brancheUser = async (id, user) => {
  const branches = await findBrancheByUser({ user });
  const branche = branches.find((item) => item._id.equals(id));
  if (!branche) return false;
  return true;
};

export const findBrancheByUser = async ({ user }) => {
  const { _id, etablissement, role } = user;
  switch (role) {
    case "admin":
      return await brancheModel.find({ etablissement });
    default:
      const { branche } = await employerModel.findById(_id);
      return await brancheModel.find({ _id: branche });
  }
};

export const findIdsBrancheByUser = async ({ user }) => {
  let branches = await findBrancheByUser({ user });
  branches = branches.map((item) => item._id);
  return branches;
};
