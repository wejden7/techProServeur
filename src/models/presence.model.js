import mongoose from "mongoose";

const presenceShema = mongoose.Schema({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Employer",
    unique: true,
  },
  presence: [
    {
      date: {
        type: Date,
        required: true,
      },
      timeStart: {
        type: Date,
        required: true,
      },
      timeEnd: {
        type: Date,
        required: true,
      },
      hourWorked: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        enum: [
          "Work",
          "Quite",
          "Holiday",
          "Not-Work",
          "Conge-Paye",
          "Conge-Not-Paye",
        ],
        required: true,
      },
      commit: {
        type: String,
        default: "",
      },
    },
  ],
});

const presenceModel = mongoose.model("Presence", presenceShema);

export default presenceModel;
