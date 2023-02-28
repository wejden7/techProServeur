import { check } from "express-validator";

export const loginValidatore = [
  check("email").custom(async (email, { req }) => {
    try {
      var validRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      const { auth } = req.body;
      if (auth === "admin") {
        if (!email.match(validRegex))
          return Promise.reject("Email is Not Valid");
      }
    } catch (error) {
      return Promise.reject("mechandise not found");
    }
  }),
  check("auth").notEmpty().withMessage("Email is required"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number"),
];
export const loginEmployerValidatore = [
  check("userName").notEmpty().withMessage("userName is required"),

  check("codeLogin")
    .notEmpty()
    .withMessage("codeLogin is required")
    .isLength({ min: 8 })
    .withMessage("code Login must contain at least 8 characters"),
];

export const registerValidatore = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 4 })
    .withMessage("Name must contain at least 4 characters"),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email address"),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number"),
];

export const emailValidatore = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email address"),
];

export const verificationCodeValidatore = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email address"),

  check("code").notEmpty().withMessage("Email is required"),
];

export const updatePasswordValidatore = [
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number"),
];

export const updateEtablissementValidatore = [
  check("label").notEmpty().withMessage("label is required"),
];

export const createZoneValidatore = [
  check("label").notEmpty().withMessage("Label is required"),
  check("branche").notEmpty().withMessage("branche is required"),
];

export const createBrancheValidatore = [
  check("label").notEmpty().withMessage("Label is required"),
];
export const updateBrancheValidatore = [
  check("label").notEmpty().withMessage("Label is required"),
];

export const createPostValidatore = [
  check("label").notEmpty().withMessage("Label is required"),
];

export const updatePostValidatore = [
  check("permission").exists().withMessage("permission is required"),
  check("label").notEmpty().withMessage("Label is required"),
];

export const createEmployerValidatore = [
  check("name").notEmpty().withMessage("Name is required"),
  check("timeWork").notEmpty().withMessage("Time Work is required"),
  check("post").notEmpty().withMessage("Post is required"),
  check("branche").notEmpty().withMessage("Branche is required"),
];
