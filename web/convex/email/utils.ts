import { pretty, render } from '@react-email/render';
import { internal } from 'convex/_generated/api';
import type { DataModel } from 'convex/_generated/dataModel';
import type { GenericActionCtx } from 'convex/server';
import { stripHtml } from 'string-strip-html';

export interface SendEmailOptions {
    from?: string | null;
    to: string;
    subject: string;
    component?: React.ReactNode;
    html?: string;
    text?: string;
}

interface SendEmailInternalOptions {
    from?: string;
    to: string;
    subject: string;
    html: string;
    text: string;
}

async function sendEmailInternal(
    ctx: GenericActionCtx<DataModel>,
    options: SendEmailInternalOptions
) {
    return ctx.runAction(
        internal.email.internal_sender.sendEmailInternal,
        options
    );
}

async function sendEmailHTTP(
    options: SendEmailInternalOptions
) {
    return fetch(`${process.env.CONVEX_SELF_HOSTED_URL}/http/email/send`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.SERVICE_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
    });
}

export async function sendEmail(
    ctx: 'http' | GenericActionCtx<DataModel>,
    options: SendEmailOptions) {
    let html: string;
    let text: string;
    if (options.html) {
        html = options.html;
        text = options.text || stripHtml(html).result;
    } else if (options.component) {
        html = await pretty(await render(options.component));
        text = options.text || await render(options.component, {
            plainText: true
        });
    } else {
        throw new Error("No HTML or component provided");
    }

    const internalOptions: SendEmailInternalOptions = {
        from: options.from || undefined,
        to: options.to,
        subject: options.subject,
        html: options.html || "",
        text,
    };

    if (ctx === 'http') {
        return sendEmailHTTP(internalOptions);
    } else {
        return sendEmailInternal(ctx, internalOptions);
    }
}
