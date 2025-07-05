import { internal } from "convex/_generated/api";
import { httpAction } from "convex/_generated/server";
import { checkServiceToken } from "convex/auth";

export const sendEmailPost = httpAction(async (ctx, request) => {
    const { to, subject, html } = await request.json();

    checkServiceToken(request);

    await ctx.runAction(internal.email.internal_sender.sendEmailInternal, {
        to,
        subject,
        html,
    });

    return new Response("Email sent", { status: 200 });
});
