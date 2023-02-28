import express from "express";
import * as C from "../controllers/employer.controller.js";

import { createEmployerValidatore } from "#helpers/validator.js";
import { Authorization } from "../middleware/authorization.middleware.js";

const router = express.Router();

router.post(
  "/employer",
  Authorization("admin", "gerant", "Rh"),
  createEmployerValidatore,
  C.create
);
router.delete(
  "/employer/:id",
  Authorization("admin", "gerant", "Rh"),
  C.remove
);
router.put(
  "/employer/:id",
  Authorization("admin", "gerant", "Rh"),
  createEmployerValidatore,
  C.update
);
router.put(
  "/employer/:id/codeLogin",
  Authorization("admin", "gerant", "Rh"),
  C.updateCodeLogin
);
router.get("/employer", Authorization("admin", "gerant", "Rh"), C.find);

export default router;
