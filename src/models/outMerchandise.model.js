import mongoose from "mongoose";
import { getValue } from "../helpers/service.js";

const outShema = mongoose.Schema(
  {
    count: {
      type: mongoose.Types.Decimal128,
      required: true,
      get: getValue,
    },
    demond: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "DemondMerchandise",
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
const outMerchandiseShema = mongoose.Schema({
  merchandise: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Merchandise",
  },
  month: { type: Date, required: true },
  out: [{ type: outShema }],
});

outShema.set("toJSON", { getters: true });

const outMerchandiseModel = mongoose.model(
  "OutMerchandise",
  outMerchandiseShema
);

export default outMerchandiseModel;
