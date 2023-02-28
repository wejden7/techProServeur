import express from "express";

import * as C from "../controllers/zone.controller.js";

import { createZoneValidatore } from "#helpers/validator.js";
import { Authorization } from "../middleware/authorization.middleware.js";

const router = express.Router();

router.post("/zone",Authorization("admin","gerant"), createZoneValidatore, C.create);
router.delete("/zone/:id",Authorization("admin","gerant"), C.remove);
router.get("/zone/:id", C.findById);
router.delete("/branche/:id/zone",Authorization("admin","gerant"), C.deleteByBranche);
router.get("/branche/:id/zone", C.findByBranche);
router.put("/zone/:id",Authorization("admin","gerant"), C.openClose);

export default router;
