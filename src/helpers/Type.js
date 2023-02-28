import { round } from "mathjs";
function partSalaial({ taux = "-", gain = "-", retenue = "-" }) {
  this.taux = taux;
  this.gain = gain;
  this.retenue = retenue;
}
function partPatronale({ taux = "-", retenue = "-" }) {
  this.taux = taux;
  this.retenue = retenue;
}
function itemTablePaie({
  n,
  designation,
  nomber,
  base,
  part_salaial = partSalaial,
  part_patronale = partPatronale,
  imported = false,
}) {
  this.n = n;
  this.designation = designation;
  this.nomber = nomber;
  this.base = base;
  this.part_salaial = part_salaial;
  this.part_patronale = part_patronale;
  this.imported = imported;
}

export const pushRetenu = ({ retenue, calcule }) => {
  const { salarial, employer, label } = retenue;
  return new itemTablePaie({
    n: 1,
    designation: label,
    base: "-",
    nomber: "-",
    part_salaial: new partSalaial({
      taux: !salarial?.formul ? salarial?.taux : "-",
      retenue: calcule.ReSalarial,
    }),
    part_patronale: new partPatronale({
      taux: !employer?.formul ? employer?.taux : "-",
      retenue: calcule.ReEmployer,
    }),
    imported: false,
  });
};

export const pushGain = ({
  label,
  gain,
  impo = false,
  base = "-",
  nomber = "-",
}) => {
  return new itemTablePaie({
    n: 1,
    designation: label,
    base,
    nomber,
    part_salaial: new partSalaial({
      gain: round(gain, 3),
    }),
    part_patronale: new partPatronale({}),

    imported: impo,
  });
};

export const pushTotaleRetenu = ({ totleCategore2, totleCategore1 }) => {
  return new itemTablePaie({
    n: 1,
    designation: "totle Retenue",
    base: "-",
    nomber: "-",
    part_salaial: new partSalaial({
      retenue: round(totleCategore2.salaire + totleCategore1.salaire,3),
    }),
    part_patronale: new partPatronale({
      retenue: round(totleCategore2.employer + totleCategore1.employer,3),
    }),

    imported: true,
  });
};
