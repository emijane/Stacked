// This component is used to ensure that a profile exists for the authenticated user. It makes a POST request to the /api/profile/ensure API route when the component mounts. The API route will check if a profile already exists for the user, and if not, it will create one with default values. This component can be included in any page or layout where you want to guarantee that the user's profile is set up before rendering the rest of the content.
// Note: This component does not handle loading states or errors. It simply fires and forgets the request to ensure the profile exists. You may want to enhance it with error handling or loading indicators as needed.

"use client";

import { useEffect } from "react";

export default function EnsureProfile() {
    useEffect(() => {
        fetch("/api/profile/ensure", { method: "POST" });
    }, []);

    return null;
}
