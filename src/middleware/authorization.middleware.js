import employerModel from "#models/employer.model.js";
export const Authorization = (...tags) => {
  return async (req, res, next) => {
    let { user } = req;

    if (user.role === "admin") {
      const admin = tags.find((item) => item === "admin");
      if (!admin) return next("not authorized");
      return next();
    }
    if (tags.includes("salairie")) return next();
    const employer = await employerModel
      .findById(user._id)
      .populate([
        { path: "post", populate: { path: "permission" } },
        { path: "branche" },
      ]);

    const { permission } = employer.post;

    const permissionExiste = permission.filter((item, index) =>
      tags.includes(item.tag)
    );

    if (permissionExiste.length === 0) {
      return next("not authorized");
    } else {
      return next();
    }
  };
};

export const AuthorizationAdminMiddleware = async (req, res, next) => {
  const { method, url, originalUrl, user } = req;

  if (user.role === "admin") return next();

  return next("not authorized");
};
