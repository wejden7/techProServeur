import mongoose from "mongoose";
import { getValue } from "../helpers/service.js";

const entreeShema = mongoose.Schema(
  {
    count: {
      type: mongoose.Types.Decimal128,
      required: true,
      get: getValue,
    },
    priceUnit: {
      type: mongoose.Types.Decimal128,
      required: true,
      get: getValue,
    },
    priceTotale: {
      type: mongoose.Types.Decimal128,
      required: true,
      get: getValue,
    },
  },
  {
    id: false,
    timestamps: {
      createdAt: "created_at", // Use `created_at` to store the created date
      updatedAt: "updated_at", // and `updated_at` to store the last updated date
    },
  }
);
const entreeMerchandiseShema = mongoose.Schema({
  merchandise: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Merchandise",
  },
  month: { type: Date, required: true },
  entree: [{ type: entreeShema }],
});

entreeShema.set("toJSON", { getters: true });

const entreeMerchandiseModel = mongoose.model(
  "EntreeMerchandise",
  entreeMerchandiseShema
);
export default entreeMerchandiseModel;
