import { Request, Response, NextFunction } from "express";
import { Webhook, WebhookRequiredHeaders } from "svix";
import * as dotenv from 'dotenv'
import { createUser, deleteUserByClerkId, updateUserByClerkId } from "../services/user.services";
import { NewUsers } from "../db/schema/indexSchema";

dotenv.config()

export const clerkWebhookController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.header('svix-id')

        if(!id) {
            res.status(400).json({status: 'error', message: "Missing Svix ID"})
            return
        }

        const timestamp = req.header('svix-timestamp')

        if(!timestamp) {
            res.status(400).json({status: 'error', message: "Missing Svix timestamp"})
            return
        }

        const signature = req.header('svix-signature')

        if(!signature) {
            res.status(400).json({status: 'error', message: "Missing Svix signature"})
            return
        }

        const headers: WebhookRequiredHeaders = {
            "svix-id": id,
            "svix-timestamp": timestamp,
            "svix-signature": signature
        }

        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)

        let payload: any

        try {
            const rawBody = req.body.toString();
            payload = wh.verify(rawBody, headers);
        } catch (err) {
            res.status(401).json({status: 'error', message: "Invalid webhook signature"})
            return
        }

        const { type, data } = payload

        switch(type) {
            case 'user.created':
                const primaryEmail = data.email_addresses?.find(
                (email: any) => email.id === data.primary_email_address_id
                    )?.email_address ?? null;


                console.log("createUser input:", {
                    clerkId: data.id,
                    email: primaryEmail,
                });

                await createUser({
                    clerkId: data.id,
                    email: primaryEmail,
                });

                break
            case 'user.updated':
                await updateUserByClerkId(data.id, {
                    email: data.email_addresses[0].email_address,
                })
            case 'user.deleted':
                await deleteUserByClerkId(data.id)
                break
            default:
                break
        }

        res.status(200).json({status: 'success', message: "Webhook received"})
        } catch (error) {
        next(error)
    }
}