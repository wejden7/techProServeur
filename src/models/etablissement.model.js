import mongoose from "mongoose";

const etablissementShema = mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },
    pays: {
      type: String,
    },
    ncnss: {
      type: String,
    },
    matriculeFiscale: {
      type: String,
    },
    registreCommerce: {
      type: String,
    },
    rib: {
      type: String,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const etablissementModel = mongoose.model("Etablissement", etablissementShema);

export default etablissementModel;
