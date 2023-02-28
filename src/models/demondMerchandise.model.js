import mongoose from "mongoose";
import { getValue } from "../helpers/service.js";

const listDemondShema = mongoose.Schema(
  {
    count: {
      type: mongoose.Types.Decimal128,
      required: true,
      get: getValue,
    },
    merchandise: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Merchandise",
    },
  },
  { id: false }
);

const demondMerchandiseShema = mongoose.Schema(
  {
    list: [{ type: listDemondShema }],
    status: { type: String, default: "envoyer", enum: ["envoyer", "traite"] },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Employer",
    },
  },
  {
    timestamps: {
      createdAt: "created_at", // Use `created_at` to store the created date
      updatedAt: "updated_at", // and `updated_at` to store the last updated date
    },
  }
);

listDemondShema.set("toJSON", { getters: true });

const demondMerchandiseModel = mongoose.model(
  "DemondMerchandise",
  demondMerchandiseShema
);

export default demondMerchandiseModel;
