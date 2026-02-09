import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type Region = "NA" | "EU" | "APAC";
type Role = "Tank" | "DPS" | "Support";
type Platform = "PC" | "Console";

type UpdateBody = {
    bio: string | null;
    region: Region;
    timezone: string | null;
    current_rank: string;
    main_role: Role;
    is_lft: boolean;
    platforms: Platform[];
};

export async function POST(request: Request) {
    const { userId } = await auth();

    if (!userId) {
        return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as UpdateBody;

    const rank = (body.current_rank || "Unranked").trim();
    if (!rank) {
        return Response.json({ ok: false, error: "Current rank is required." }, { status: 400 });
    }

    const platforms = Array.isArray(body.platforms) ? body.platforms : [];

    const updated = await supabaseAdmin
        .from("profiles")
        .update({
            bio: body.bio ? body.bio.trim() : null,
            region: body.region,
            timezone: body.timezone ? body.timezone.trim() : null,
            current_rank: rank,
            main_role: body.main_role,
            is_lft: body.is_lft,
        })
        .eq("id", userId);

    if (updated.error) {
        return Response.json({ ok: false, error: updated.error.message }, { status: 500 });
    }

    // Replace platforms (simple)
    const deleted = await supabaseAdmin
        .from("profile_platforms")
        .delete()
        .eq("profile_id", userId);

    if (deleted.error) {
        return Response.json({ ok: false, error: deleted.error.message }, { status: 500 });
    }

    if (platforms.length > 0) {
        const inserted = await supabaseAdmin
            .from("profile_platforms")
            .insert(
                platforms.map((p) => ({
                    profile_id: userId,
                    platform: p,
                }))
            );

        if (inserted.error) {
            return Response.json({ ok: false, error: inserted.error.message }, { status: 500 });
        }
    }

    return Response.json({ ok: true });
}
