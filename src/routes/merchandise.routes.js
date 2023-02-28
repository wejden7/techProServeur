import express from "express";

import * as C from "../controllers/merchandise.controller.js";
import { Authorization } from "../middleware/authorization.middleware.js";
import * as V from "../validator/merchandise.validator.js";

const router = express.Router();

router.post("/merchandise", Authorization("admin","stocke"), V.create, C.create);
router.put("/merchandise/:id", Authorization("admin","stocke"), V.update, C.update);
router.delete("/merchandise/:id", Authorization("admin","stocke"), C.remove);
router.get("/merchandise", Authorization("admin","gerant","stocke"), C.findAll);
//router.get("/merchandise/:id", C.findById);
export default router;
