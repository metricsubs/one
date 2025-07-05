import { httpAction } from "./_generated/server";

export const exampleHttpAction = httpAction(async () => {
    return new Response(
        "Hello, world!",
        {
            status: 200
        }
    );
});
