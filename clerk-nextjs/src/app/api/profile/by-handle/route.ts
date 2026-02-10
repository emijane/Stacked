import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const handle = (url.searchParams.get("handle") || "").toLowerCase().trim();

    if (!handle) {
        return Response.json({ ok: false, error: "Missing handle." }, { status: 400 });
    }

    const profile = await supabaseAdmin
        .from("profiles")
        .select("id, handle, display_name, avatar_url, bio, region, timezone, current_rank, main_role, is_lft")
        .eq("handle", handle)
        .maybeSingle();

    if (profile.error) {
        return Response.json({ ok: false, error: profile.error.message }, { status: 500 });
    }

    if (!profile.data) {
        return Response.json({ ok: false, error: "Profile not found." }, { status: 404 });
    }

    const platforms = await supabaseAdmin
        .from("profile_platforms")
        .select("platform")
        .eq("profile_id", profile.data.id);

    if (platforms.error) {
        return Response.json({ ok: false, error: platforms.error.message }, { status: 500 });
    }

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
