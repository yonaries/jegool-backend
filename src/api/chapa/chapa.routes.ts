import { Router } from "express";
import ChapaController from "./chapa.controller";
import { validateInitializeChapa } from "./chapa.validate";
import { verifyToken } from "@/middlewares/firebase.middlewares";

const router = Router();
router.get("/callback", verifyToken, ChapaController.callback);
router.get("/success", verifyToken, ChapaController.success);

export default router;
