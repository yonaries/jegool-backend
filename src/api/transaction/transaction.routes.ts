import express from "express";
import TransactionController from "./transaction.controller";

const router = express.Router();

router.post("/", TransactionController.createTransaction);

export default router;
