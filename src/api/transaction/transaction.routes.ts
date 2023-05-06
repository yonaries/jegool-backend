import express from "express";
import TransactionController from "./transaction.controller";

const router = express.Router();

router.post("/", TransactionController.createTransaction);
router.get("/:reference", TransactionController.getTransactionByReference);

export default router;
