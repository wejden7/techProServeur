import mongoose from "mongoose";

const brancheShema = mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  etablissement: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Etablissement",
  },
  adresse: {
    type: String,
  },
  tel: {
    type: String,
  },
});

const brancheModel = mongoose.model("Branche", brancheShema);

export default brancheModel;
