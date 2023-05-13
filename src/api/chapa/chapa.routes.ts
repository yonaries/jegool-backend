import { Router } from "express";
import ChapaController from "./chapa.controller";

const router = Router();

router.get("/callback", ChapaController.callback);
router.get("/success");

export default router;
