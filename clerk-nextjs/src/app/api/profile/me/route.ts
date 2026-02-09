import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const profile = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

    if (profile.error) {
        return Response.json({ ok: false, error: profile.error.message }, { status: 500 });
    }

    const platforms = await supabaseAdmin
        .from("profile_platforms")
        .select("platform")
        .eq("profile_id", userId);

    if (platforms.error) {
        return Response.json({ ok: false, error: platforms.error.message }, { status: 500 });
    }

    return Response.json({
        ok: true,
        profile: profile.data,
        platforms: platforms.data.map((p) => p.platform),
    });
}
