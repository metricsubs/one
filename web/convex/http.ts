import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { sendEmailPost } from "./email/http_sender";
import { exampleHttpAction } from "./example";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
    path: "/example",
    method: "GET",
    handler: exampleHttpAction,
});

http.route({
    path: "/email/send",
    method: "POST",
    handler: sendEmailPost,
});

export default http;
