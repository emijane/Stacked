// This API route checks if the user is signed in by using Clerk's server-side auth function. 
// It returns a JSON response indicating whether the user is signed in and includes the user ID if available. 
// This can be used for debugging or to conditionally render content based on the user's authentication status.
// http://localhost:3000/api/clerk-check

import { auth } from "@clerk/nextjs/server";

// The GET function is the handler for GET requests to this API route.
// In production, we return a 404 Not Found response to avoid exposing authentication status.
// In development, we check the authentication status and return it in the response for debugging purposes.
export async function GET() {
    if (process.env.NODE_ENV === "production") {
        return new Response("Not found", { status: 404 });
    }

    const { userId } = await auth();
    return Response.json({ signedIn: !!userId });
}
