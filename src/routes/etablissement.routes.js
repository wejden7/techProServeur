import express from "express";
import * as C from "../controllers/etablissement.controller.js";

import { updateEtablissementValidatore } from "#helpers/validator.js";

import { Authorization } from "../middleware/authorization.middleware.js";

const router = express.Router();

router.put(
  "/etablissement",
  Authorization("admin"),
  updateEtablissementValidatore,
  C.update
);
router.get("/etablissement", C.find);

export default router;
