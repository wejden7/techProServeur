import { evaluate, round } from "mathjs";
import { pourcentage, toArray } from "../helpers/service.js";
import { pushRetenu, pushGain, pushTotaleRetenu } from "../helpers/Type.js";
import {
  findPresenceByEmployerOfListDate,
  getCongePays,
  getWorkHours,
} from "../service/presence.service.js";
import { getListDateOfMonth } from "../helpers/service.js";

export const selectObject = ({ arrayObject, arrayIds }) => {
  return arrayObject.filter((item) => arrayIds.includes(item._id.toString()));
};

export const workDetails = async ({ date, id, tauxHorer, result }) => {
  const base = tauxHorer;
 // const listDate = getListDateOfMonth(date);
  const presence = await findPresenceByEmployerOfListDate(id, date);
  console.log("presence", presence);

  const workHour = getWorkHours(presence, tauxHorer);
  var { hourWork: nomber, calcule: gain } = workHour;

  result.push(pushGain({ label: "Salaire de base", base, nomber, gain }));

  const congePaye = getCongePays(presence, tauxHorer);
  var { calcule: gain, Conge_Paye: nomber } = congePaye;

  result.push(pushGain({ label: "Conge paye", base, nomber, gain }));

  return result;
};

export const bonusCalcule = ({ bonus, result }) => {
  bonus.forEach(({ label, amount }, index) => {
    result.push(pushGain({ label, gain: amount }));
  });
  return result;
};

export const calculerSalaireBrut = ({ result }) => {
  let somme = 0;
  result.forEach(({ part_salaial }) => (somme += part_salaial.gain));
  result.push(pushGain({ label: "Totle Brut", gain: somme, impo: true }));
  return { result, salaireBrut: somme };
};

export const retenueCalcule = ({ result, salaireBrut, retenue, select }) => {
  let categore = retenue.filter((item) => item.categaure === 1);
  let salaire = salaireBrut;

  const calcule1 = calculeCategorie({ categore, salaire, result, select });

  const { result: R1, calcule: salaireImpo, totle: totleCategore1 } = calcule1;
  result = R1;

  result.push(
    pushGain({ label: "salaire impose", gain: salaireImpo, impo: true })
  );

  categore = retenue.filter((item) => item.categaure === 2);
  salaire = salaireImpo;

  const calcule2 = calculeCategorie({ categore, salaire, result, select });
  const { result: R2, calcule: salaireNet, totle: totleCategore2 } = calcule2;
  result = R2;

  result.push(pushTotaleRetenu({ totleCategore1, totleCategore2 }));
  result.push(pushGain({ label: "Salaire Net", gain: salaireNet, impo: true }));

  return result;
};

// * * * * * * * * * * * * * * * * *

const getRetenueCalcule = ({ retenue, salaire, select }) => {
  const { retenuFor, salarial, employer } = retenue;
  switch (retenuFor) {
    case "all":
      var ReSalarial = calcule({ retenue: salarial, salaire, select });
      var ReEmployer = calcule({ retenue: employer, salaire, select });
      return { ReSalarial, ReEmployer };
    case "salarial":
      var ReSalarial = calcule({ retenue: salarial, salaire, select });
      return { ReSalarial, ReEmployer: 0 };
    case "employer":
      var ReEmployer = calcule({ retenue: employer, salaire, select });
      return { ReEmployer, ReSalarial: 0 };
  }
};

const calculeCategorie = ({ categore, salaire, result, select }) => {
  let calculeSalire = salaire;
  let totleRetenur = { salaire: 0, employer: 0 };

  categore.forEach((retenue) => {
    const calcule = getRetenueCalcule({ retenue, salaire, select });

    totleRetenur.salaire += calcule.ReSalarial;
    totleRetenur.employer += calcule.ReEmployer;

    calculeSalire -= calcule.ReSalarial;

    result.push(pushRetenu({ retenue, calcule }));
  });
  return { result, totle: totleRetenur, calcule: round(calculeSalire, 3) };
};

const formuleEdite = ({ salaire, formul, select }) => {
  const { parametre } = select;

  let result = salaire.toString();
  const arrayFormule = toArray({ formul });

  arrayFormule.forEach((item) => {
    result = result + item.slice(0, 1);

    if (item.indexOf("%") != -1) {
      const taux = item.slice(1, -1);
      result += pourcentage({ value: salaire, taux });
    } else if (item.indexOf("chf") != -1) {
      result += "0";
    } else if (item.indexOf("sm") != -1) {
      result += parametre.salaryMin;
    } else {
      result += item;
    }
  });

  return result;
};

const calcule = ({ retenue, salaire, select }) => {
  const { taux, formul, amount } = retenue;
  let calcule = 0;
  if (taux) {
    var value = salaire;
    if (formul) value = evaluate(formuleEdite({ salaire, formul, select }));
    calcule = pourcentage({ value, taux });
  } else if (amount) {
    calcule = amount;
  } else if (formul) {
    calcule = evaluate(formuleEdite({ salaire, formul, select }));
  }
  if (calcule < 0) return 0;
  return calcule;
};
