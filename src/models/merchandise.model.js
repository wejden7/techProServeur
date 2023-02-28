import mongoose from "mongoose";
import { preFindOneAndDelete } from "../service/merchandise.service.js";

const merchandiseShema = mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    required: true,
    enum: ["KG", "L", "Pice"],
  },
  branche: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Branche",
  },
});
merchandiseShema.pre("findOneAndDelete", preFindOneAndDelete);
const merchandiseModel = mongoose.model("Merchandise", merchandiseShema);

export default merchandiseModel;
