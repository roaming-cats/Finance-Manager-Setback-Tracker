import { Router } from "express";
import express from 'express'
import { clerkWebhookController } from "../controllers/webhooks.controller";

const router = Router()

router.post('/clerk', express.raw({ type: 'application/json' }), clerkWebhookController)

export default router