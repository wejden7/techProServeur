import mongoose from "mongoose";
const retenueCalculeSchema = new mongoose.Schema(
  {
    taux: {
      type: mongoose.Types.Decimal128,
      default: null,
      set: (v) => (v === "" ? null : v),
      get: getCosts,
    },
    amount: {
      type: mongoose.Types.Decimal128,
      default: null,
      set: (v) => (v === "" ? null : v),
      get: getCosts,
    },
    formul: {
      type: String,
      set: (v) => (v === "" ? null : v),
      default: null,
    },
  },
  { id: false }
);

const retenueSchema = new mongoose.Schema({
  label: { type: String, required: true },
  salarial: {
    type: retenueCalculeSchema,
    default: null,
  },
  employer: {
    type: retenueCalculeSchema,
    default: null,
  },
  retenuFor: {
    type: String,
    required: true,
    enum: ["salarial", "employer", "all"],
  },
  categaure: {
    type: Number,
    required: true,
    enum: [1, 2],
  },
});

const bonusSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    amount: {
      type: mongoose.Types.Decimal128,
      required: true,
      get: getCosts,
    },
  },
  { id: false }
);

const parametresShema = new mongoose.Schema(
  {
    etablissement: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Etablissement",
    },

    tauxMajourationHeuresSupp: {
      one: {
        type: mongoose.Types.Decimal128,
        default: 75,
        set: (v) => (v === "" ? 75 : v),
        get: getCosts,
      },
      tow: {
        type: mongoose.Types.Decimal128,
        default: 100,
        set: (v) => (v === "" ? 75 : v),
        get: getCosts,
      },
    },
    salaryMin: {
      type: mongoose.Types.Decimal128,
      default: 416.6,
      set: (v) => (v === "" ? 416.6 : v),
      get: getCosts,
    },
    bonus: [{ type: bonusSchema }],
    retenue: [{ type: retenueSchema }],
  },
  { id: false }
);

retenueCalculeSchema.set("toObject", { getters: true });
retenueCalculeSchema.set("toJSON", { getters: true });

bonusSchema.set("toObject", { getters: true });
bonusSchema.set("toJSON", { getters: true });

parametresShema.set("toObject", { getters: true });
parametresShema.set("toJSON", { getters: true });

function getCosts(value) {
  if (typeof value !== "undefined" && value) {
    return parseFloat(value.toString());
  }
  return value;
}
const parametresModel = mongoose.model("Parametres", parametresShema);

export default parametresModel;
