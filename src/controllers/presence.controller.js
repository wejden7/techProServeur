import presenceModel from "#models/presence.model.js";
import moment from "moment-timezone";
// * Import service

import {
  checkDayPresence,
  createPresence,
  updatePresence,
} from "#service/presence.service.js";

// * Import Express Validation
import { validationResult } from "express-validator";
import { findIdsEmployerByUser } from "../service/employer.service.js";

export const create = async (req, res, next) => {
  const { id } = req.params;
  console.log(id)
  const { date, status, commit, timeStart, timeEnd } = req.body;
  try {
    const newPresence = {
      date,
      status,
      commit,
      timeStart,
      timeEnd,
    };
    const presence = await createPresence(id, newPresence);
    console.log(presence);

    return res.status(200).json({
      message: "Cheked successfully",
      data: presence,
    });
  } catch (error) {
    console.log(error);
    return next(error.message);
  }
};
export const add = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const date = moment.tz(new Date(), "Africa/Tunis").startOf("day").format();
    const start_Work = moment.tz(new Date(), "Africa/Tunis").format();
    const end_Work = moment
      .tz(new Date(), "Africa/Tunis")
      .add(8, "hours")
      .format();

    const existe = await await presenceModel.findOne({
      employer: _id,
      presence: { $elemMatch: { date: date } },
    });

    if (existe) return next("We are checked go to Gerent");
    const newPresence = {
      date: date,
      timeStart: start_Work,
      timeEnd: end_Work,
      status: "Work",
      commit: "je presant",
    };
    const presence = await createPresence(_id, newPresence);

    return res.status(200).json({
      message: "Cheked successfully",
      data: true,
    });
  } catch (error) {
    return next(error.message);
  }
};
export const checkMePresanceController = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const date = moment.tz(new Date(), "Africa/Tunis").startOf("day").format();

    const existe = await await presenceModel.findOne({
      employer: _id,
      presence: { $elemMatch: { date: date } },
    });

    if (existe) {
      var presance = existe.presence.find((item) =>
        moment(item.date).isSame(date)
      );
    }
    return res.status(200).json({
      message: "Cheked successfully",
      data: presance?.status || null,
    });
  } catch (error) {
    return next(error.message);
  }
};

export const quite = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const date = moment.tz(new Date(), "Africa/Tunis").startOf("day").format();
    const end_Work = moment.tz(new Date(), "Africa/Tunis").format();

    const presence = await presenceModel.findOne({
      employer: _id,
      presence: { $elemMatch: { date: date } },
    });

    if (!presence) return next("date not existe ");

    let presence_of_day = await presence.presence.find((item) =>
      moment(date).isSame(item.date)
    );
    if (presence_of_day.status != "Work")
      return next("you are not peresent for quite");

    presence_of_day = updatePresence(presence_of_day, {
      timeEnd: end_Work,
      status: "Quite",
      commit: "JE Quite",
    });

    await presence.save();

    return res.status(200).json({
      message: " quite successfully",
      data: presence,
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
    const presence = await presenceModel.findOne({
      presence: { $elemMatch: { _id: id } },
    });

    let presence_of_day = await presence.presence.find((p) => p._id.equals(id));
    presence_of_day = updatePresence(presence_of_day, req.body);

    await presence.save();

    return res.status(200).json({
      message: "updater sucssed",
      data: presence_of_day,
    });
  } catch (error) {
    return next(error?.message);
  }
};

export const check = async (req, res, next) => {
  try {
    const employers = await findIdsEmployerByUser({ user: req.user });
    await checkDayPresence(employers);
    const presence = await presenceModel.find({
      employer: { $in: employers },
    });
    return res.status(200).json({
      message: "create presence successfully",
      data: presence,
    });
  } catch (error) {
    return next(error.message);
  }
};
