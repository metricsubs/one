import { httpRouter } from "convex/server";
import { exampleHttpAction } from "./example";

const http = httpRouter();

http.route({
    path: "/example",
    method: "GET",
    handler: exampleHttpAction,
});

export default http;
