// This API route ensures that a profile exists for the authenticated user.
// If a profile already exists, it does nothing. If not, it creates a new profile with default values.  

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function makeDefaultHandle(userId: string) {
    return `user-${userId.replace("user_", "").slice(0, 8)}`;
}

export async function POST() {
    const { userId } = await auth();

    if (!userId) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if profile exists
    const existing = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .maybeSingle();

    if (existing.error) {
        return Response.json({ error: existing.error.message }, { status: 500 });
    }

    if (existing.data) {
        return Response.json({ ok: true, created: false });
    }

    // Create a default profile row
    const handle = makeDefaultHandle(userId);

    const created = await supabaseAdmin
        .from("profiles")
        .insert({
            id: userId,
            handle: handle,
            display_name: "New Player",
            avatar_url: null,
            bio: null,
            region: "NA",
            timezone: "America/New_York",
            current_rank: "Unranked",
            main_role: "Support",
            is_lft: false,
        });

    if (created.error) {
        return Response.json({ error: created.error.message }, { status: 500 });
    }

    return Response.json({ ok: true, created: true });
}
