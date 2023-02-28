import parametresModel from "#models/parametres.model.js";

import { initEmployer } from "../service/employer.service.js";
import {
  bonusCalcule,
  calculerSalaireBrut,
  retenueCalcule,
  selectObject,
  workDetails,
} from "../service/parametre.service.js";

export const find = async (req, res, next) => {
  const { user } = req;
  try {
    const { etablissement } = user;
    const parametres = await parametresModel.findOne({ etablissement });
    return res.status(200).json({
      message: "",
      data: parametres,
    });
  } catch (error) {
    return next(error);
  }
};

export const update = async (req, res, next) => {
  const { user } = req;
  try {
    const { etablissement } = user;
    const data = await parametresModel.findOneAndUpdate(
      { etablissement },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    return res.status(200).json({ message: "", data });
  } catch (error) {
    return next(error);
  }
};

export const createFicheDePais = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { bonus, retenue, date } = req.body;
    console.log(date)
    const select = await initEmployer({ id });
    const { tauxHorer, parametre } = select;

    let result = [];

    result = await workDetails({ id, date, tauxHorer, result });
    bonus = selectObject({ arrayObject: parametre.bonus, arrayIds: bonus });
    result = bonusCalcule({ bonus, result });
    const resultCalculerSalaireBrut = calculerSalaireBrut({ result });
    result = resultCalculerSalaireBrut.result;
    const { salaireBrut } = resultCalculerSalaireBrut;
    retenue = selectObject({
      arrayObject: parametre.retenue,
      arrayIds: retenue,
    });
    result = retenueCalcule({ result, salaireBrut, retenue, select });
    const data = { select, result };
    return res.status(200).json({ message: "", data });
  } catch (error) {
    console.log(error);
    return next(error.message);
  }
};
