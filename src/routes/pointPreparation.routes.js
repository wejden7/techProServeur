import express from "express";

import * as C from "../controllers/pointPreparation.controller.js";

import { Authorization } from "../middleware/authorization.middleware.js";

const router = express.Router();
const bastUrl = "/pointPreparation/";
const autorization = Authorization("admin", "gerant");
router.put(`${bastUrl}:id`, autorization, C.openClose);

export default router;
