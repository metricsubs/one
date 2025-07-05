import Resend from "@auth/core/providers/resend";
import { convexAuth } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import { MagicLinkEmail } from "./email/templates/magic_link";
import { sendEmail } from "./email/utils";

export function checkServiceToken(request: Request): string {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    throw new ConvexError("Unauthorized");
  }

  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer") {
    throw new ConvexError("Unauthorized");
  }

  if (token !== process.env.SERVICE_TOKEN) {
    throw new ConvexError("Unauthorized");
  }

  return token;
}

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Resend(
      {
        name: "MetricSubs One",
        from: "metricsubs@gmail.com",
        sendVerificationRequest: async ({ url, identifier }) => {
          await sendEmail('http', {
            to: identifier,
            subject: "Login to MetricSubs One",
            component: <MagicLinkEmail
              email={identifier}
              url={url}
            />
          });
        },
      }
    )
  ],
});
