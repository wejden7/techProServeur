import express from "express";

import * as C from "../controllers/demondMerchandise.controller.js";
import * as V from "../validator/demondmerchandise.validator.js";
import { Authorization } from "../middleware/authorization.middleware.js";
const router = express.Router();

router.post(
  "/merchandise/demond",
  Authorization("contoirist", "chef"),
  V.create,
  C.create
);
router.put(
  "/merchandise/demond/:id",
  Authorization("contoirist", "chef"),
  V.update,
  C.update
);
router.delete(
  "/merchandise/demond/:id",
  Authorization("contoirist", "chef"),
  V.remove,
  C.remove
);
router.get(
  "/merchandise/demond",
  Authorization("stocke", "contoirist", "chef"),
  C.find
);
export default router;
