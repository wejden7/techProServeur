import {
  autorizationAdmin,
  autorizationSalairier,
} from "../service/Autorization.service.js";

export const autorizationController = async (req, res, next) => {
  try {
    console.log("Authorization middleware");
    let { user } = req;
    const data =
      user.role === "admin"
        ? await autorizationAdmin({ user })
        : await autorizationSalairier({ user });

    console.log(data);
    return res.status(200).json({ message: "Autorize", data });
  } catch (error) {
    console.log(error);
    return next(error.message);
  }
};
