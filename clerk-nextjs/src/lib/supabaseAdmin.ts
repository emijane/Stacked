// Supabase Admin Client
// This file creates a Supabase client using the service role key, which has elevated permissions.
// This client should only be used in server-side code (e.g., API routes) and never exposed to the browser.

import { createClient } from "@supabase/supabase-js";

// We read the Supabase URL and service role key from environment variables.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// We throw an error if either the Supabase URL or service role key is missing, as both are required to create the client.
if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
}

// The service role key is required to create the admin client, which has elevated permissions. 
// If it's missing, we throw an error to prevent creating a client that won't work properly.
if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
}

// We create the Supabase client using the URL and service role key. 
// This client will be used for server-side operations that require elevated permissions, such as managing user profiles.
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
