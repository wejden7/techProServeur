import { validationResult } from "express-validator";

//* import * from helpers
import { postUser } from "#service/post.service.js";

//* import  from models
import postModel from "#models/post.model.js";


export const create = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) return next(err.errors);

  const { label } = req.body;
  try {
    const { etablissement } = req.user;

    const post = await postModel.create({
      label,
      etablissement: etablissement,
    });
    return res.status(200).json({
      message: "post created successfully",
      data: post,
    });
  } catch (error) {
    return next(error.message);
  }
};

export const update = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) return next(err.errors);

  const { id } = req.params;

  try {
    const existe = await postUser(id, req.user);
    if (!existe) return next("existe not found or not authorized");
    const post = await postModel.findById(id);
    if (!post) return next("post not found");
    post.permission = req.body.permission;
    post.label = req.body.label;
    await post.save();
    return res.status(200).json({
      message: "post update successfully",
      data: post,
    });
  } catch (error) {
    return next(error.message);
  }
};

export const findById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const existe = await postUser(id, req.user);
    if (!existe) return next("post not found or not authorized");

    const post = await postModel.findById(id).populate("etablissement");
    if (!post) return next("post not found");

    return res.status(200).json({
      message: "post find successfully",
      data: post,
    });
  } catch (error) {
    return next(error.message);
  }
};
export const findAll = async (req, res, next) => {
  try {
    const { etablissement } = req.user;

    const post = await postModel
      .find({ etablissement })
      .populate("etablissement");
    // if (post.length === 0) return next("post not found");

    return res.status(200).json({
      message: "post find successfully",
      data: post,
    });
  } catch (error) {
    return next(error.message);
  }
};

export const remove = async (req, res, next) => {
  const { id } = req.params;

  try {
    const existe = await postUser(id, req.user);
    if (!existe) return next("post not found or not authorized");

    const post = await postModel.findByIdAndDelete(id);
    if (!post) return next("post not found");
    return res.status(200).json({
      message: "post find successfully",
      data: id,
    });
  } catch (error) {
    return next(error.message);
  }
};
