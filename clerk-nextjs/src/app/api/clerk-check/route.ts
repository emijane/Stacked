// This API route checks if the user is signed in by using Clerk's server-side auth function. 
// It returns a JSON response indicating whether the user is signed in and includes the user ID if available. 
// This can be used for debugging or to conditionally render content based on the user's authentication status.

import { auth } from "@clerk/nextjs/server";

export async function GET() {
    const { userId } = await auth();
    return Response.json({ signedIn: !!userId, userId });
}
