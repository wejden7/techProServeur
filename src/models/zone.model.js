import mongoose from "mongoose";

const zoneShema = mongoose.Schema({
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

const zoneModel = mongoose.model("Zone", zoneShema);

export default zoneModel;
