import express from "express";

import { autorizationController } from "#controllers/Autorization.controller.js";

import { Authorization } from "../middleware/authorization.middleware.js";

const router = express.Router();

router.get("/autorization", Authorization("admin","salairie"), autorizationController);

export default router;
