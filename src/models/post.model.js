import mongoose from "mongoose";

const postShema = mongoose.Schema({
  label: {
    type: String,
    require: true,
  },
  permission: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PermissionTags",
    },
  ],
  etablissement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Etablissement",
  },
});

const postModel = mongoose.model("Post", postShema);

export default postModel;
