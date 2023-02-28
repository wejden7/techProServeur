 import express from "express";

import * as C from "../controllers/permissionTags.controller.js";
import { Authorization } from "../middleware/authorization.middleware.js";

const router = express.Router();

router.post("/permission", Authorization("admin"), C.create);
router.get("/permission", Authorization("admin"), C.find);

export default router;
