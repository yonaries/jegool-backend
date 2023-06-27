import { Router } from "express";
import ChapaController from "./chapa.controller";
import { validateInitializeChapa } from "./chapa.validate";
import { verifyToken } from "@/middlewares/firebase.middlewares";

const router = Router();
router.get("/callback", ChapaController.callback);
router.get("/success", ChapaController.success);

export default router;
