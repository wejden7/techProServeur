import userModel from "#models/user.model.js";
import employerModel from "#models/employer.model.js";
import bcrypt from "bcryptjs";
import { etablissementByEmployer } from "../service/etablissement.service.js";

export const loginAdmin = async ({ email, password }) => {
  const user = await userModel.findOne({ email }).populate("etablissement");
  if (!user) throw Error(` Email not found`);

  if (!bcrypt.compareSync(password, user.password))
    throw Error("incorrect password");
  return { user, etablissement: user.etablissement };
};

export const loginEmployer = async ({ userName, codeLogin }) => {
  const employer = await employerModel.findOne({ userName }).populate("post");
  if (!employer) throw Error(` uUer Name not found`);

  if (!bcrypt.compareSync(codeLogin, employer.codeLogin))
    throw Error("incorrect code Login");
  const etablissement = await etablissementByEmployer({
    id: employer._id,
  });
  return { user: employer, etablissement };
};
//qehOu6jF
//wejden122