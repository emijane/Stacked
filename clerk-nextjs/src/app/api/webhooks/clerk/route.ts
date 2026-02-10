import { NextRequest } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { createClient } from "@supabase/supabase-js";
import type { UserJSON } from "@clerk/backend";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    }
);

export async function POST(req: NextRequest) {
    try {
        const evt = await verifyWebhook(req);

        if (evt.type !== "user.created" && evt.type !== "user.updated") {
            return new Response("Ignored", { status: 200 });
        }

        const user = evt.data as UserJSON;

        const handle = (user.username ?? "").trim() || user.id;

        const displayName =
            `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || handle;

        const avatarUrl = user.image_url ?? null;

        // 1) Try update existing row
        const { data: updatedRows, error: updateError } = await supabase
            .from("profiles")
            .update({
                handle,
                display_name: displayName,
                avatar_url: avatarUrl,
            })
            .eq("id", user.id)
            .select("id");

        if (updateError) {
            console.error("Supabase UPDATE error:", updateError);
            return new Response("DB update error", { status: 500 });
        }

        // 2) If no row exists, insert one
        if (!updatedRows || updatedRows.length === 0) {
            const { error: insertError } = await supabase
                .from("profiles")
                .insert({
                    id: user.id,
                    handle,
                    display_name: displayName,
                    avatar_url: avatarUrl,
                });

            if (insertError) {
                console.error("Supabase INSERT error:", insertError);
                return new Response("DB insert error", { status: 500 });
            }
        }

        return new Response("OK", { status: 200 });
    } catch (err) {
        console.error("Webhook error:", err);
        return new Response("Invalid signature", { status: 400 });
    }
}
