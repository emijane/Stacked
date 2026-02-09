// This API route checks if the Supabase client can successfully connect to the database by performing a simple query.
// It returns a JSON response indicating whether the connection was successful, any error message, and how many records were returned from the query. This can be used for debugging database connection issues.
// http://localhost:3000/api/supabase-check

import { supabaseAdmin } from "@/lib/supabaseAdmin";

// The GET function is the handler for GET requests to this API route. 
// It performs a simple query to the "profiles" table, selecting the "id" column and limiting the results to 1 record.
export async function GET() {
    const result = await supabaseAdmin
        .from("profiles")
        .select("id")
        .limit(1);

    return Response.json({
        ok: !result.error,
        error: result.error?.message ?? null,
        countReturned: result.data?.length ?? 0,
    });
}
