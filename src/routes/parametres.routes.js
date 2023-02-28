import express from "express";

import * as C from "../controllers/parametres.controller.js";
import { Authorization } from "../middleware/authorization.middleware.js";

const router = express.Router();
router.get("/parametre", Authorization("admin"), C.find);
router.put("/parametre", Authorization("admin"), C.update);

router.post("/paie/:id", Authorization("admin","gerant" ,"Rh"), C.createFicheDePais);

export default router;
