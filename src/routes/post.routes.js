import express from "express";

import * as C from "../controllers/post.controller.js";

import {
  createPostValidatore,
  updatePostValidatore,
} from "#helpers/validator.js";

import { Authorization } from "../middleware/authorization.middleware.js";

const router = express.Router();

router.post("/post", Authorization("admin"), createPostValidatore, C.create);
router.put("/post/:id", Authorization("admin"), updatePostValidatore, C.update);
router.get("/post/:id", C.findById);
router.get("/post", C.findAll);
router.delete("/post/:id", Authorization("admin"), C.remove);

export default router;
