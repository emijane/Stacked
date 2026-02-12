// This is the public profile page that can be accessed via /u/[handle]. 
// It fetches the profile data from the API route we defined earlier and displays it.

type Region = "NA" | "EU" | "APAC";
type Role = "Tank" | "DPS" | "Support";
type Platform = "PC" | "Console";

// Define the structure of the API response for better type safety and clarity in the component.
type ApiResponse = {
    ok: boolean;
    error?: string;
    profile?: {
        handle: string;
        display_name: string;
        avatar_url: string | null;
        bio: string | null;
        region: Region;
        timezone: string | null;
        current_rank: string;
        main_role: Role;
        is_lft: boolean;
    };
    platforms?: Platform[];
};

// The main component for the public profile page. It receives the handle as a parameter, 
// fetches the profile data from the API, and renders it.
export default async function PublicProfilePage({
    // The 'params' object contains the dynamic route parameters, in this case, 
    // the 'handle' which is used to fetch the profile data.
    params,
}: {
    params: Promise<{ handle: string }>;
}) {
    const { handle } = await params;

    //
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/profile/by-handle?handle=${encodeURIComponent(handle)}`,
        { cache: "no-store" }
    );

    // Parse the JSON response from the API and cast it to the defined ApiResponse 
    // type for better type safety.
    const data = (await res.json()) as ApiResponse;

    // If the response is not OK, or if the API response indicates an error, 
    // or if the profile data is missing,
    if (!res.ok || !data.ok || !data.profile) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-semibold">Profile not found</h1>
                <p className="mt-2 opacity-80">{data.error || "Unknown error."}</p>
            </div>
        );
    }

    // If the profile data is successfully retrieved, 
    // we extract the profile information and platforms
    const p = data.profile;
    const platforms = data.platforms || [];

    return (
        <div className="p-6 w-full">
            <div className="flex justify-between gap-6 max-w-4xl mx-auto border rounded-2xl">
                <div className="flex items-center gap-4 p-5">
                    <div className="h-16 w-16 rounded-full overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                        {p.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.avatar_url} alt={p.display_name} className="h-full w-full object-cover" />
                        ) : (
                            <span className="text-sm opacity-70">No Img</span>
                        )}
                    </div>

                    <div>
                        <h1 className="text-2xl font-semibold">{p.display_name}</h1>
                        <div className="text-sm opacity-80">@{p.handle}</div>
                        <p className="opacity-90 whitespace-pre-wrap">
                            {p.bio || "—"}
                        </p>
                    </div>
                </div>

                <div className="mt-4 rounded-md border border-white/10 bg-white/5 p-4 text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div><span className="opacity-70">Role:</span> {p.main_role}</div>
                        <div><span className="opacity-70">Rank:</span> {p.current_rank}</div>
                        <div><span className="opacity-70">Region:</span> {p.region}</div>
                        <div><span className="opacity-70">Timezone:</span> {p.timezone || "—"}</div>
                        <div className="sm:col-span-2">
                            <span className="opacity-70">Platforms:</span>{" "}
                            {platforms.length ? platforms.join(", ") : "—"}
                        </div>
                        <div className="sm:col-span-2">
                            <span className="opacity-70">LFT:</span> {p.is_lft ? "Yes" : "No"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
