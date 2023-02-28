import { validationResult } from "express-validator";

// * import from models
import userModel from "#models/user.model.js";
import employerModel from "#models/employer.model.js";
import etablissementModel from "#models/etablissement.model.js";

// * import from service
import { loginAdmin, loginEmployer } from "../service/auth.service.js";
import {
  createToken,
  randomString,
  durationHourUpdate,
  bcryptService,
} from "../helpers/service.js";
import { createDefaultEtablissement } from "#service/etablissement.service.js";
import sendMail from "#helpers/sendMail.js";

export const register = async (req, res, next) => {
  const { email, password } = req.body;

  const err = validationResult(req);
  if (!err.isEmpty()) return next(err.errors);

  try {
    const user = await userModel.findOne({ email });
    if (user) return next(` This email already exists`);

    req.body.password = bcryptService(password);
    const etablissement = await createDefaultEtablissement();
    req.body.etablissement = etablissement._id;
    const newUser = await userModel.create(req.body);
    const tokenObject = {
      _id: newUser._id,
      etablissement: newUser.etablissement._id,
      role: "admin",
    };
    const token = createToken(tokenObject);

    return res.status(201).json({
      message: "User created successfully",
      data: newUser,
      token: token,
    });
  } catch (error) {
    console.log(error);
    next(error.message);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  const err = validationResult(req);
  if (!err.isEmpty()) return next(err.errors);

  try {
    const user = await userModel.findOne({ email });
    if (!user) return next("L’adresse mail est inconnue");

    const code = randomString(4);

    user.code = code;
    user.save();

    await sendMail(user.email, code);

    return res
      .status(200)
      .json({ message: "email code send successfully", data: user.email });
  } catch (error) {
    return next(error.message);
  }
};

export const verificationCode = async (req, res, next) => {
  const { email, code } = req.body;

  const err = validationResult(req);
  if (!err.isEmpty()) return next(err.errors);

  try {
    const user = await userModel.findOne({ email, code });
    if (!user) return next("Code not valide, merci de réessayer");

    const hour = durationHourUpdate(user.updated_at);
    if (hour < 1) {
      const token = createToken({
        id: user._id,
        etablissement: user.etablissement,
        role: "admin",
      });
      return res.status(200).json({ message: "code valide", token: token });
    }

    user.code = null;
    user.save();
    return next("code not valide réessayer de nouveau ");
  } catch (error) {
    return next(error.message);
  }
};

// Reglage user token dont have password
export const updatePassword = async (req, res, next) => {
  const { password } = req.body;
  const { user } = req;
  const err = validationResult(req);
  if (!err.isEmpty()) return next(err.errors);
  try {
    const newUser = await userModel.findOne({ _id: user._id });
    if (bcryptServiceCompar(password, newUser.password))
      return next("change password : Old password does not match");
    newUser.password = bcryptService(password);
    newUser.code = null;
    newUser.save();
    return res.status(200).json({ message: "password update" });
  } catch (error) {
    return next(error.message);
  }
};
export const login = async (req, res, next) => {
  try {
    const { email, password, auth } = req.body;

    const err = validationResult(req);
    if (!err.isEmpty()) return next(err.errors);

    const { user, etablissement } =
      auth === "admin"
        ? await loginAdmin({ email, password })
        : await loginEmployer({ userName: email, codeLogin: password });
    const { _id, name } = user;
    const role = auth === "admin" ? "admin" : user.post.label;
    const TextLogin = auth === "admin" ? user.email : user.userName;
    const tokenObject = { _id, etablissement: etablissement._id, role };
    const token = createToken(tokenObject);
    const data = { _id, name, TextLogin, role };
    return res
      .status(201)
      .json({ message: "login successfully", data, etablissement, token });
  } catch (error) {
    return next(error.message);
  }
};
export const loginbyToken = async (req, res, next) => {
  const { _id, etablissement, role } = req.user;

  let user;
  if (role === "admin") {
    user = await userModel.findById({ _id: _id });
  } else {
    user = await employerModel.findById({ _id: _id });
  }

  const etablissement_ = await etablissementModel.findById({
    _id: etablissement,
  });

  const resault = {
    _id: user._id,
    name: user.name,
    TextLogin: user.email || user.userName,
    role: role,
  };
  return res.status(200).json({
    message: "login successfully",
    data: resault,
    etablissement: etablissement_,
  });
};
