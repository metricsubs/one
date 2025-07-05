import { ConvexError } from "convex/values";

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
