import express from 'express';
import SubscriptionController from './subscription.controller';

const router = express.Router();

router.post('/', SubscriptionController.createSubscription);



export default router;