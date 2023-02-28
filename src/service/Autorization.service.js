import employerModel from "#models/employer.model.js";
import userModel from "#models/user.model.js";

export const autorizationAdmin = async ({ user }) => {
  const {permission} = await userModel.findById(user._id).populate("permission");
  permission.push({ name: "Admin", tag: "admin" });
  return permission;
};

export const autorizationSalairier = async ({ user }) => {
  const employer = await employerModel
    .findById(user._id)
    .populate([
      { path: "post", populate: { path: "permission" } },
      { path: "branche" },
    ]);

  return employer.post.permission;
};
