import Jwt from "jsonwebtoken";
import moment from "moment-timezone";
import bcrypt from "bcryptjs";
import { round } from "mathjs";

export const createToken = ({ _id, etablissement, role }) => {
  return Jwt.sign({ _id, etablissement, role }, process.env.KEY_JWT, {
    expiresIn: "1d",
  });
};

export const randomString = (len, charSet) => {
  charSet =
    charSet || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var randomString = "";
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
};

export const durationHourUpdate = (date) => {
  const now = moment(date); //todays date
  const end = moment(new Date()); // another date
  const duration = moment.duration(end.diff(now));
  return duration.asHours();
};

export const bcryptService = (text) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(text, salt);
};

export const bcryptServiceCompar = (text, textCrypte) => {
  return bcrypt.compareSync(text, textCrypte);
};

export const CalculeTauxHorer = (salaire = 0, hourWorkofWeek = 0) => {
  return round(salaire / ((hourWorkofWeek * 52) / 12), 3);
};
export const getListDateOfMonth = (date) => {
  let dateDebutMonth = moment(date).startOf("month");
  let t = [];
  while (dateDebutMonth.isSame(date, "month")) {
    t.push(dateDebutMonth.format());
    dateDebutMonth = dateDebutMonth.add(1, "day");
  }
  return t;
};

export const toArray = ({ formul }) => {
  ["-", "+", "*", "/"].forEach((i) => (formul = formul.replaceAll(i, " " + i)));
  return formul.trim().split(" ");
};

export const pourcentage = ({ value, taux }) => {
  const calculer = (parseFloat(value) / 100) * parseFloat(taux);
  return round(calculer, 3);
};

export function getValue(value) {
  if (typeof value !== "undefined" && value) {
    return parseFloat(value.toString());
  }
  return value;
}
