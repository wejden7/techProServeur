import express from "express";
import * as C from "../controllers/destroyMerchandise.controller.js";
import * as V from "../validator/destroyMerchandise.validator.js";
import { Authorization } from "../middleware/authorization.middleware.js";

const router = express.Router();
const baseUrl = "/merchandise/destroy";
const Authorization_ = Authorization("admin", "stocke");


router.post("/merchandise/:id/destroy", Authorization_, V.create, C.create);
router.get(baseUrl, Authorization_, C.findAll); // * Find All Destroy Merchandise by user
router.delete(baseUrl + "/:id/:destroyId", Authorization_, V.remove, C.remove);
router.put(baseUrl + "/:id", Authorization_, V.update, C.update);

export default router;
