import presenceModel from "#models/presence.model.js";
import employerModel from "#models/employer.model.js";
import moment from "moment-timezone";
import { CronJob } from "cron";
import { findIdsEmployer } from "./employer.service.js";

export const checkDayPresence = async (employers) => {
  for await (let id of employers) {
    const date = moment.tz(new Date(), "Africa/Tunis");
    const hour = date.hour();
    const date_day = date.startOf("day").format();
    const { presence, employer } = await findPresenceByEmployer(id);
    const startWork = date.isSameOrAfter(employer.dateStart);
    const existe = presence.find((item) => moment(item.date).isSame(date_day));
    console.log(date);
    const holiday =
      date.format("dddd").toUpperCase() === employer.holiday.toUpperCase();
    let newPresence = {
      date: date_day,
      timeStart: date_day,
      timeEnd: date_day,
      status: "Not-Work",
      commit: "Not Work",
    };
    if (holiday) {
      newPresence.status = "Holiday";
      newPresence.commit = "Holiday";
    }
    if (!existe && startWork) {
      if (hour > employer.timeWork.start) {
        await createPresence(id, newPresence);
      }
    }
  }
};

const checkDayPresenceAll = async () => {
  const employer = await findIdsEmployer();
  await checkDayPresence(employer);
};

export const createPresence = async (id, data) => {
  data.hourWorked = diffHours(data.timeEnd, data.timeStart);
  const presenceEmployer = await presenceModel.findOne({ employer: id });
  await presenceEmployer.presence.addToSet(data);
  await presenceEmployer.save();
  return presenceEmployer;
};

export const updatePresence = (presence, date) => {
  const { timeStart, timeEnd, status, commit } = date;
  presence.timeStart = timeStart || presence.timeStart;
  presence.timeEnd = timeEnd;
  presence.hourWorked = diffHours(presence.timeEnd, presence.timeStart);
  presence.status = status;
  presence.commit = commit;
  return presence;
};

const diffHours = (d1, d2) => {
  const date1 = moment(d1, "YYYYMMDD HH:mm");
  const date2 = moment(d2, "YYYYMMDD HH:mm");
  return date1.diff(date2, "hours");
};

const findPresenceByEmployer = async (id) => {
  return await presenceModel
    .findOne({
      employer: id,
    })
    .populate("employer");
};

// * job function active at all 30 minutes
const job = new CronJob("*/30 * * * *", async () => {
  console.log("Job active at all 30 minutes");
  console.log(moment().format("HH:mm:ss"));
  await checkDayPresenceAll();
});

job.start();

export const findPresenceByEmployerOfListDate = async (id, date) => {
  try {
    const { presence } = (await presenceModel.findOne({ employer: id })) || {
      presence: [],
    };
    let data = presence.filter((item, index) => {
      if (moment(item.date).isSame(date, "month")) return item;
    });

    return data;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const getWorkHours = (presence, tauxHorer) => {
  let list = presence.filter(
    (item) => item.status === "Work" || item.status == "Quite"
  );
  let hourWork = 0;
  for (let i of list) {
    hourWork = hourWork + i.hourWorked;
  }
  let calcule = hourWork * tauxHorer;
  return { hourWork, calcule, list };
};

export const getCongePays = (presence, tauxHorer) => {
  let list = presence.filter((item) => item.status === "Conge-Paye");
  let Conge_Paye = list.length;
  let calcule = Conge_Paye * 8 * tauxHorer;
  return { Conge_Paye: Conge_Paye, calcule: calcule, list };
};
