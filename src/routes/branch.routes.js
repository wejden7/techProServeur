import express from "express";

import * as C from "../controllers/branch.controller.js";

import {
  createBrancheValidatore,
  updateBrancheValidatore,
} from "#helpers/validator.js";

import { Authorization } from "../middleware/authorization.middleware.js";

const router = express.Router();

router.post(
  "/branche",
  Authorization("admin"),
  createBrancheValidatore,
  C.create
);
router.put(
  "/branche/:id",
  Authorization("admin"),
  updateBrancheValidatore,
  C.update
);
router.get("/branche/:id", C.findById);
router.get("/branche", C.findByEtablissement);

router.delete("/branche/:id", Authorization("admin"), C.remove);

export default router;
