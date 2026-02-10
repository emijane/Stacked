// This API route ensures that a profile exists for the authenticated user.
// If a profile already exists, it may sync handle/avatar/display_name from Clerk (only if handle looks auto-generated).
// If not, it creates a new profile with default values.

import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Utility functions for handle generation and uniqueness checks
// This function takes an input string and transforms it into a slugified version that is URL-friendly and 
// meets formatting requirements for handles. It converts the string to lowercase, replaces spaces with hyphens, 
// removes invalid characters, collapses multiple hyphens, and trims the result to a maximum length of 20 characters. 
// This ensures that the generated handle is clean and consistent.
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

// Generates a random alphanumeric string of the specified length
// Used for creating unique handles when there are collisions or when the base handle is not suitable
function randomSuffix(length: number = 4) {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let out = "";
    for (let i = 0; i < length; i += 1) {
        out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
}

// This function attempts to find a unique handle by checking the database for existing profiles with the same handle.
// It starts with a base handle and, if it finds a collision, it appends a random suffix and checks again, up to a certain 
// number of attempts.
async function findUniqueHandle(base: string) {
    const safeBase = base || `player-${randomSuffix(6)}`;
    let candidate = safeBase;

    // Try up to 6 variations of the handle (base + random suffix) to find a unique one
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

        // If we find a collision, generate a new candidate by appending a random suffix to the base and check again
        candidate = `${safeBase}-${randomSuffix(4)}`.slice(0, 20);
    }

    // If we exhaust all attempts, return a fallback handle with a random suffix to ensure uniqueness
    return `player-${randomSuffix(8)}`.slice(0, 20);
}

// The main handler for the POST request to ensure a profile exists. It performs the following steps:
// 1. Authenticates the user and retrieves their Clerk profile information.
// 2. Generates a base handle from the Clerk username or email, and ensures it's unique in the database.
// 3. Checks if a profile already exists for the user ID. If it does, it may sync the handle/display_name/avatar if the existing handle looks like a generated placeholder.
// 4. If no profile exists, it creates a new one with the generated handle and other default values.
export async function POST() {
    try {
        const { userId } = await auth();

        // If the user is not authenticated, return a 401 Unauthorized response. This ensures that only authenticated users can create or sync profiles.
        if (!userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Pull data from Clerk (used for both create and sync)
        const user = await currentUser();

        // Generate a base handle using the Clerk username or email prefix. If neither is available, use a fallback based on the user ID.
        const clerkUsername = user?.username ?? "";
    // Extract the email prefix (the part before the @) to use as a potential handle if the username is not available. This provides a more user-friendly default handle.
    const email = user?.emailAddresses?.[0]?.emailAddress ?? "";
    // The raw handle is determined by the following priority:
    const emailPrefix = email.split("@")[0] ?? "";

    // The raw handle is determined by the following priority:
    const rawHandle =
        clerkUsername ||
        emailPrefix ||
        `player-${userId.replace("user_", "").slice(0, 8)}`;

    // The base handle is a slugified version of the raw handle, which ensures it is URL-friendly and meets any formatting requirements. If the slugified version is empty (e.g., if the raw handle had no valid characters), we fall back to a generic "player-" handle with a random suffix.
    // We then find a unique handle based on this base, which checks the database for collisions and appends random suffixes if needed to ensure uniqueness.
    const baseHandle = slugifyHandle(rawHandle) || `player-${randomSuffix(6)}`;
    const uniqueHandle = await findUniqueHandle(baseHandle);

    // For display name, we prioritize the full name (first + last) from Clerk, then the username, 
    // then the email prefix, and finally a generic "New Player" if none of those are available. 
    // This provides a more personalized default display name for the user.
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

    // If there's an error checking for the existing profile, return a 500 Internal Server Error response with the error message.
    if (existingProfile.error) {
        return Response.json({ error: existingProfile.error.message }, { status: 500 });
    }

    // If profile exists, sync ONLY if the handle looks like a generated placeholder
    if (existingProfile.data) {
        const currentHandle = existingProfile.data.handle;
        const looksGenerated = currentHandle.startsWith("user-") || currentHandle.startsWith("player-");

        // If the current handle looks like a generated one, we will attempt to sync it with the new desired handle based on 
        // Clerk data. This allows users who signed up before we implemented this logic to have their profiles automatically 
        // updated with more personalized handles and display names without affecting users who have already customized their 
        // handles.
        if (clerkUsername && looksGenerated) {
            const desiredBase = slugifyHandle(clerkUsername);
            const desiredHandle = await findUniqueHandle(desiredBase);

            // If the desired handle is different from the current one, we will update it in the database. 
            // This ensures that users get a more personalized handle based on their Clerk username, but only if 
            // they haven't already set a custom handle.
            const updated = await supabaseAdmin
                .from("profiles")
                .update({
                    handle: desiredHandle,
                    display_name: displayName,
                    avatar_url: avatarUrl,
                })
                .eq("id", userId);
            
            // If there's an error during the update, return a 500 Internal Server Error response with the error message.
            if (updated.error) {
                return Response.json({ error: updated.error.message }, { status: 500 });
            }

            // If the update was successful, return a response indicating that the profile was synced with the new handle.
            return Response.json({ ok: true, created: false, synced: true, handle: desiredHandle });
        }

        // If the existing handle does not look generated, we will not sync it to avoid overwriting a custom handle that 
        // the user may have set.
        return Response.json({ ok: true, created: false, synced: false, handle: currentHandle });
    }

    // Create a new profile
    // If no profile exists for the user, we create a new one with the generated unique handle and other default values.
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

    // If there's an error during profile creation, return a 500 Internal Server Error response with the error message.
    // This ensures that any issues with creating the profile are properly communicated to the client.
    if (created.error) {
        return Response.json({ error: created.error.message }, { status: 500 });
    }

    // If the profile was created successfully, return a response indicating that the profile was created with the new
    // unique handle.
    return Response.json({ ok: true, created: true, synced: false, handle: uniqueHandle });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return Response.json({ error: message }, { status: 500 });
    }
}
