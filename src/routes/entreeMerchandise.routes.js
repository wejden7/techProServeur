import express from "express";
import * as C from "../controllers/entreeMerchandise.controller.js";
import * as V from "../validator/entrreMarchandise.validator.js";
import { Authorization } from "../middleware/authorization.middleware.js";

const router = express.Router();
const baseUrl = "/merchandise/entree";
const secondUrl = "/merchandise/:id/entree";
const Authorization_ = Authorization("admin", "stocke");

router.post(baseUrl, Authorization_, V.create, C.create);
router.get(baseUrl, Authorization_, C.findAll);
router.get(secondUrl, Authorization_, V.findByMerchandise, C.findByMerchandise);
router.get(baseUrl + "/:id", Authorization_, V.findById, C.findById);
router.put(baseUrl + "/:id", Authorization_, V.update, C.update);
router.delete(baseUrl + "/:id/:entreeId", Authorization_, V.remove, C.remove);

export default router;
