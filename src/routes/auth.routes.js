import express from "express";
import * as C from "../controllers/auth.controller.js";
import * as V from "../helpers/validator.js";

import auth from "#middleware/auth.middleware.js";
const router = express.Router();

router.post("/register", V.registerValidatore, C.register);
router.post("/login", V.loginValidatore, C.login);
//router.post("/login-employer", V.loginEmployerValidatore, C.loginEmployer);
router.post("/forgotPassword", V.emailValidatore, C.forgotPassword);
router.post(
  "/verificationCode",
  V.verificationCodeValidatore,
  C.verificationCode
);
router.post(
  "/updatePassword",
  auth,
  V.updatePasswordValidatore,
  C.updatePassword
);
router.get("/loginToken", auth, C.loginbyToken);
export default router;
