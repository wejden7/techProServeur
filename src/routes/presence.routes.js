import express from "express";

import * as C from "../controllers/presence.controller.js";

import { Authorization } from "../middleware/authorization.middleware.js";

const router = express.Router();

router.post("/presence-work", Authorization("salairie"), C.add);
router.post("/presence-quite", Authorization("salairie"), C.quite);
router.post(
  "/presence-check",
  Authorization("salairie"),
  C.checkMePresanceController
);
router.put("/presence/:id", Authorization("Rh", "admin"), C.update);
router.post("/presence/:id", Authorization("Rh", "admin"), C.create);
router.get("/presence", Authorization("admin", "gerant", "Rh"), C.check);

export default router;
