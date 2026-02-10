import { supabaseAdmin } from "@/lib/supabaseAdmin";

// This API route handles GET requests to fetch a user profile based on a provided handle. 
// It retrieves the profile information from the database and returns it in a structured format, 
// along with the platforms associated with that profile. If the handle is missing, 
// if the profile is not found, or if there are any database errors, it responds with appropriate 
// error messages and status codes.

export async function GET(request: Request) {
    // Parse the incoming request URL to extract the 'handle' query parameter. 
    // The handle is expected to be a unique identifier for the user's profile.
    const url = new URL(request.url);
    const handle = (url.searchParams.get("handle") || "").toLowerCase().trim();

    // Validate that the handle is provided. If it's missing, respond with a 400 Bad Request 
    // status and an error message.
    if (!handle) {
        return Response.json({ ok: false, error: "Missing handle." }, { status: 400 });
    }

    // Query the 'profiles' table in the database to find a profile that matches the provided handle.
    const profile = await supabaseAdmin
        .from("profiles")
        .select("id, handle, display_name, avatar_url, bio, region, timezone, current_rank, main_role, is_lft")
        .eq("handle", handle)
        .maybeSingle();

    // If there's an error during the database query, respond with a 500 Internal Server Error 
    // status and the error message.
    if (profile.error) {
        return Response.json({ ok: false, error: profile.error.message }, { status: 500 });
    }

    // If no profile is found with the given handle, respond with a 404 Not Found status and an 
    // error message.
    if (!profile.data) {
        return Response.json({ ok: false, error: "Profile not found." }, { status: 404 });
    }

    // If the profile is found, we proceed to fetch the platforms associated with that profile from the 
    // 'profile_platforms' table. We filter the platforms by the profile's ID.
    const platforms = await supabaseAdmin
        .from("profile_platforms")
        .select("platform")
        .eq("profile_id", profile.data.id);

    // If there's an error during the platforms query, respond with a 500 Internal Server Error 
    // status and the error message.
    if (platforms.error) {
        return Response.json({ ok: false, error: platforms.error.message }, { status: 500 });
    }

    // Finally, if everything is successful, we return a JSON response containing the profile 
    // information and the list of platforms.
    return Response.json({
        ok: true,
        profile: {
            handle: profile.data.handle,
            display_name: profile.data.display_name,
            avatar_url: profile.data.avatar_url,
            bio: profile.data.bio,
            region: profile.data.region,
            timezone: profile.data.timezone,
            current_rank: profile.data.current_rank,
            main_role: profile.data.main_role,
            is_lft: profile.data.is_lft,
        },
        platforms: platforms.data.map((p) => p.platform),
    });
}
