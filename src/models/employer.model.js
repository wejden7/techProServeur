import mongoose from "mongoose";

const min = [
  0,
  "The value of path `{PATH}` ({VALUE}) is beneath the limit ({MIN}).",
];
const max = [
  24,
  "The value of path `{PATH}` ({VALUE}) exceeds the limit ({MAX}).",
];

const employerShema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  codeLogin: {
    type: String,
    required: true,
  },
  dateStart: {
    type: Date,
    required: true,
  },
  cnss :{
    type: String,
    required: true,
  },
  cin :{
    type: String,
    required: true,
  },
  address:{
    type: String,
  },
  rib:{
    type: String,
  },
  salaryType: {
    type: String,
    required: true,
    enum: ["month", "hour"],
  },
  salaryBase: {
    type: mongoose.Types.Decimal128,
    required: true,
    get: getCosts
  },
  holiday: {
    type: String,
    required: true,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  WorkHoursPerWeek: {
    type: Number,
    required: true,
    min: [40, "min 40h per week"],
    max: [48, "max 48h per week"],
  },
  timeWork: {
    start: {
      type: Number,
      required: true,
      min: min,
      max: max,
    },
    end: {
      type: Number,
      required: true,
      min: min,
      max: max,
    },
  },

  post: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Post",
  },
  branche: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Branche",
  },
  familyStatus: {
    status: {
      type: String,
      default: "Single",
      enum: ["Single", "Married", "Divorced"],
    },
    enfant: [
      {
        age: Number,
      },
    ],
  },
},{toJSON: {getters: true}});
function getCosts(value) {
  if (typeof value !== 'undefined') {
     return parseFloat(value.toString());
  }
  return value;
};
const employeeModel = mongoose.model("Employer", employerShema);

export default employeeModel;
