import mongoose from "mongoose";

const pointPreparationShema = mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  ferme: { type: Boolean, default: false },
  branche: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branche",
    required: true,
  },
});

const pointPreparationModel = mongoose.model(
  "PointPreparation",
  pointPreparationShema
);

export default pointPreparationModel;
