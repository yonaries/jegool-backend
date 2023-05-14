import { Router } from "express";
import ChapaController from "./chapa.controller";
import { validateInitializeChapa } from "./chapa.validate";

const router = Router();
router.post("/initialize", validateInitializeChapa, ChapaController.initialize);
router.get("/callback", ChapaController.callback);
router.get("/success", ChapaController.success);

export default router;
