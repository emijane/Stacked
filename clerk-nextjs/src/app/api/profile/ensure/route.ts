// This API route ensures that a profile exists for the authenticated user.
// If a profile already exists, it may sync handle/avatar/display_name from Clerk (only if handle looks auto-generated).
// If not, it creates a new profile with default values.

import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function slugifyHandle(input: string) {
    return input
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9_-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^[-_]+|[-_]+$/g, "")
        .slice(0, 20);
}

function randomSuffix(length: number = 4) {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let out = "";
    for (let i = 0; i < length; i += 1) {
        out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
}

async function findUniqueHandle(base: string) {
    const safeBase = base || `player-${randomSuffix(6)}`;
    let candidate = safeBase;

    for (let attempt = 0; attempt < 6; attempt += 1) {
        const existing = await supabaseAdmin
            .from("profiles")
            .select("handle")
            .eq("handle", candidate)
            .maybeSingle();

        if (existing.error) {
            throw new Error(existing.error.message);
        }

        if (!existing.data) {
            return candidate;
        }

        candidate = `${safeBase}-${randomSuffix(4)}`.slice(0, 20);
    }

    return `player-${randomSuffix(8)}`.slice(0, 20);
}

export async function POST() {
    const { userId } = await auth();

    if (!userId) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Pull data from Clerk (used for both create and sync)
    const user = await currentUser();

    const clerkUsername = user?.username ?? "";
    const email = user?.emailAddresses?.[0]?.emailAddress ?? "";
    const emailPrefix = email.split("@")[0] ?? "";

    const rawHandle =
        clerkUsername ||
        emailPrefix ||
        `player-${userId.replace("user_", "").slice(0, 8)}`;

    const baseHandle = slugifyHandle(rawHandle) || `player-${randomSuffix(6)}`;
    const uniqueHandle = await findUniqueHandle(baseHandle);

    const firstName = user?.firstName ?? "";
    const lastName = user?.lastName ?? "";
    const fullName = `${firstName} ${lastName}`.trim();

    const displayName = fullName || clerkUsername || (emailPrefix ? emailPrefix : "New Player");
    const avatarUrl = user?.imageUrl ?? null;

    // Check if profile already exists
    const existingProfile = await supabaseAdmin
        .from("profiles")
        .select("id, handle")
        .eq("id", userId)
        .maybeSingle();

    if (existingProfile.error) {
        return Response.json({ error: existingProfile.error.message }, { status: 500 });
    }

    // If profile exists, sync ONLY if the handle looks like a generated placeholder
    if (existingProfile.data) {
        const currentHandle = existingProfile.data.handle;
        const looksGenerated = currentHandle.startsWith("user-") || currentHandle.startsWith("player-");

        if (clerkUsername && looksGenerated) {
            const desiredBase = slugifyHandle(clerkUsername);
            const desiredHandle = await findUniqueHandle(desiredBase);

            const updated = await supabaseAdmin
                .from("profiles")
                .update({
                    handle: desiredHandle,
                    display_name: displayName,
                    avatar_url: avatarUrl,
                })
                .eq("id", userId);

            if (updated.error) {
                return Response.json({ error: updated.error.message }, { status: 500 });
            }

            return Response.json({ ok: true, created: false, synced: true, handle: desiredHandle });
        }

        return Response.json({ ok: true, created: false, synced: false, handle: currentHandle });
    }

    // Create a new profile
    const created = await supabaseAdmin.from("profiles").insert({
        id: userId,
        handle: uniqueHandle,
        display_name: displayName,
        avatar_url: avatarUrl,
        bio: null,
        region: "NA",
        timezone: null,
        current_rank: "Unranked",
        main_role: "Support",
        is_lft: false,
    });

    if (created.error) {
        return Response.json({ error: created.error.message }, { status: 500 });
    }

    return Response.json({ ok: true, created: true, synced: false, handle: uniqueHandle });
}
