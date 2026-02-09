"use client";

import React, { useEffect, useState } from "react";
import ProfileSettingsForm, { ProfileFormValues, Region, Role, Platform } from "@/components/ProfileSettingsForm";

// The ProfileSettingsPage component is a client-side React component that manages the state and logic for the user's 
// profile settings page.
type ProfileResponse = {
    ok: boolean;
    error?: string | null;
    profile: {
        handle: string;
        display_name: string;
        bio: string | null;
        region: Region;
        timezone: string | null;
        current_rank: string;
        main_role: Role;
        is_lft: boolean;
        avatar_url?: string | null;
    } | null;
    platforms: Platform[];
};

// The component uses several pieces of state to manage loading, saving, error messages, success messages, and the profile 
// data itself.
export default function ProfileSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [handle, setHandle] = useState("");
    const [displayName, setDisplayName] = useState("");

    // The values state holds the form values for the profile settings, including bio, region, timezone, current rank, 
    // main role,
    const [values, setValues] = useState<ProfileFormValues>({
        bio: "",
        region: "NA",
        timezone: "",
        currentRank: "Unranked",
        mainRole: "Support",
        platformPC: false,
        platformConsole: false,
        isLft: false,
    });

    // The useEffect hook is used to load the user's profile data when the component mounts. It makes a GET request to the 
    // /api/profile/me API route to fetch the profile information and platforms. The response is then used to populate the 
    // form values and handle/display name states. If there's an error during loading, it sets the error state accordingly.
    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setError(null);
                setSuccess(null);

                const res = await fetch("/api/profile/me", { method: "GET" });
                const data = (await res.json()) as ProfileResponse;

                // If the response is not ok or the data indicates an error, we set the error state and stop loading.
                if (!res.ok || !data.ok) {
                    setError(data.error || "Failed to load profile.");
                    setLoading(false);
                    return;
                }

                // If the profile data is missing from the response, we set an error message indicating that the 
                // profile was not found.
                if (!data.profile) {
                    setError("Profile not found. Try signing out and back in.");
                    setLoading(false);
                    return;
                }

                // If the profile data is successfully retrieved, we populate the handle, display name, and 
                // form values with the data from the response. 
                // We also set loading to false to indicate that the data has finished loading.
                setHandle(data.profile.handle || "");
                setDisplayName(data.profile.display_name || "");

                const platforms = data.platforms || [];

                // We set the form values based on the profile data, ensuring that we provide default values 
                // if any of the fields are missing or null.
                setValues({
                    bio: data.profile.bio || "",
                    region: data.profile.region || "NA",
                    timezone: data.profile.timezone || "",
                    currentRank: data.profile.current_rank || "Unranked",
                    mainRole: data.profile.main_role || "Support",
                    platformPC: platforms.includes("PC"),
                    platformConsole: platforms.includes("Console"),
                    isLft: !!data.profile.is_lft,
                });

                setLoading(false);
            } catch (e) {
                setError("Something went wrong while loading your profile.");
                setLoading(false);
            }
        }

        load();
    }, []);

    // The onSave function is called when the user saves their profile settings. 
    // It sends a POST request to the /api/profile/update
    async function onSave() {
        setError(null);
        setSuccess(null);
        setSaving(true);

        // We construct the platforms array based on the form values for platformPC and platformConsole.
        try {
            const platforms: Platform[] = [];
            if (values.platformPC) platforms.push("PC");
            if (values.platformConsole) platforms.push("Console");

            // We make a POST request to the /api/profile/update endpoint with the updated profile information 
            // in the request body.
            const res = await fetch("/api/profile/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bio: values.bio.trim() ? values.bio.trim() : null,
                    region: values.region,
                    timezone: values.timezone.trim() ? values.timezone.trim() : null,
                    current_rank: values.currentRank.trim() || "Unranked",
                    main_role: values.mainRole,
                    is_lft: values.isLft,
                    platforms: platforms,
                }),
            });

            // We parse the response and check if the update was successful. 
            // If not, we set the error state with the error message from the response.
            const data = (await res.json()) as { ok?: boolean; error?: string };

            // If the response is not ok or the data indicates an error, we set the error state and stop the saving state.
            if (!res.ok || !data.ok) {
                setError(data.error || "Failed to save profile.");
                setSaving(false);
                return;
            }

            setSuccess("Saved!");
            setSaving(false);
        } catch (e) {
            setError("Something went wrong while saving.");
            setSaving(false);
        }
    }

    // Finally, we render the ProfileSettingsForm component, passing down all the necessary props for loading, saving, 
    // error handling, success messages, and form values. 
    // The form component will handle the actual UI for displaying and editing the profile settings.
    return (
        <ProfileSettingsForm
            loading={loading}
            saving={saving}
            error={error}
            success={success}
            handle={handle}
            displayName={displayName}
            values={values}
            onChange={setValues}
            onSave={onSave}
        />
    );
}
