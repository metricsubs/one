"use node";

import { internalAction } from "convex/_generated/server";
import { v } from "convex/values";
import { createTransport } from 'nodemailer';
import { stripHtml } from 'string-strip-html';

const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");

const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export const sendEmailInternal = internalAction({
    args: {
        from: v.optional(v.string()),
        to: v.string(),
        subject: v.string(),
        html: v.string(),
        text: v.optional(v.string()),
    },
    handler: async (_ctx, args) => {
        const html = args.html;
        const text = args.text || stripHtml(html).result;

        const mailOptions = {
            from: args.from || process.env.SMTP_FROM,
            to: args.to,
            subject: args.subject,
            html,
            text,
        };

        return await transporter.sendMail(mailOptions);
    },
});
