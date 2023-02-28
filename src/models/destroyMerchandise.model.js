import mongoose from "mongoose";

const destroyShema = mongoose.Schema(
  {
    count: {
      type: mongoose.Types.Decimal128,
      required: true,
      get: getValue,
    },
    comment: {
      type: String,
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
const destroyMerchandiseShema = mongoose.Schema({
  merchandise: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Merchandise",
  },
  month: { type: Date, required: true },
  destroy: [{ type: destroyShema }],
});
destroyShema.set("toJSON", { getters: true });

function getValue(value) {
  if (typeof value !== "undefined" && value) {
    return parseFloat(value.toString());
  }
  return value;
}

const destroyMerchandiseModel = mongoose.model(
  "DestroyMerchandise",
  destroyMerchandiseShema
);
export default destroyMerchandiseModel;
