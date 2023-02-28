import express from "express";
import * as C from "../controllers/outMerchandise.controller.js";
import { Authorization } from "../middleware/authorization.middleware.js";

import * as V from "../validator/outMerchandise.validator.js";
const router = express.Router();
router.post("/merchandise/out", Authorization("stocke"), V.create, C.create);
router.get(
  "/merchandise/:id/out",
  Authorization("admin", "gerant", "stocke"),
  V.findByMerchandise,
  C.findByMerchandise
);
router.get(
  "/merchandise/out/:id",
  Authorization("stocke"),
  V.findById,
  C.findById
);
router.put("/merchandise/out/:id", Authorization("stocke"), V.update, C.update);
router.delete(
  "/merchandise/out/:id/:outId",
  Authorization("stocke"),
  V.remove,
  C.remove
);
export default router;
