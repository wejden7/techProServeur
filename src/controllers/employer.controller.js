import employerModel from "#models/employer.model.js";
import presenceModel from "#models/presence.model.js";

import { brancheUser } from "#service/branche.service.js";
import { randomString } from "#helpers/service.js";
import { postUser } from "#service/post.service.js";
import { employerUser } from "#service/employer.service.js";

import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { findIdsBrancheByUser } from "../service/branche.service.js";

export const create = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) return next(err.errors);
  const { post, branche, userName } = req.body;

  try {
    const postExiste = await postUser(post, req.user);
    if (!postExiste) return next("post not found");
    const brancheExiste = await brancheUser(branche, req.user);
    if (!brancheExiste) return next("branche not found");
    const employerExiste = await employerModel.findOne({ userName });
    if (employerExiste) return next("userName existe");
    const codeLogin = randomString(8);
    const salt = bcrypt.genSaltSync(10);
    req.body.codeLogin = bcrypt.hashSync(codeLogin, salt);
    const employer = await employerModel.create(req.body);
    await presenceModel.create({ employer: employer._id, presence: [] });

    return res.status(200).json({
      message: "employer created successfully",
      data: employer,
      codeLogin: codeLogin,
    });
  } catch (error) {
    return next(error.message);
  }
};

export const find = async (req, res, next) => {
  const { user } = req;

  try {
    const branches = await findIdsBrancheByUser({ user });
    const employers = await employerModel
      .find({ branche: { $in: branches } })
      .select("-codeLogin");
    return res.status(200).json({
      message: "Employer deleted successfully",
      data: employers,
    });
  } catch (error) {
    return next(error.message);
  }
};

export const remove = async (req, res, next) => {
  const { id } = req.params;

  try {
    const existe = await employerUser(id, req.user);
    if (!existe) return next("employer not found or  not authorized");
    const employer = await employerModel.findByIdAndDelete(id);
    if (!employer) return next("employer not found");

    return res.status(200).json({
      message: "Employer deleted successfully",
      data: id,
    });
  } catch (error) {
    return next(error.message);
  }
};

export const update = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) return next(err.errors);

  const { id } = req.params;
  const { post, branche } = req.body;

  try {
    const existe = await employerUser(id, req.user);
    if (!existe) return next("employer not found or  not authorized");
    const postExiste = await postUser(post, req.user);
    if (!postExiste) return next("post not found");
    const brancheExiste = await brancheUser(branche, req.user);
    if (!brancheExiste) return next("branche not found");

    const employee = await employerModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      message: "Employer update successfully",
      data: employee,
    });
  } catch (error) {
    return next(error.message);
  }
};

export const updateCodeLogin = async (req, res, next) => {
  const { id } = req.params;

  try {
    const existe = await employerUser(id, req.user);
    if (!existe) return next("employer not found or  not authorized");

    const employer = await employerModel.findById(id);

    const codeLogin = randomString(8);
    
    const salt = bcrypt.genSaltSync(10);
    employer.codeLogin = bcrypt.hashSync(codeLogin, salt);

    await employer.save();
    return res.status(200).json({
      message: "code Login Employer update successfully",
      data: codeLogin,
    });
  } catch (error) {
    return next(error.message);
  }
};
