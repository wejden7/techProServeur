import mongoose from "mongoose";

const permissionTagsShema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
    unique: true,
  },
});

const permissionTagsModel = mongoose.model(
  "PermissionTags",
  permissionTagsShema
);

export default permissionTagsModel;
