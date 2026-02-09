// This API route checks if the necessary Supabase environment variables are set.
// It returns a JSON object indicating which variables are present. This can be used for debugging and ensuring that the environment is properly configured.
// ALL SHOULD RETURN TRUE
// http://localhost:3000/api/env-check

// The GET function is the handler for GET requests to this API route.
export async function GET() {
    return Response.json({
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasService: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    });
}
