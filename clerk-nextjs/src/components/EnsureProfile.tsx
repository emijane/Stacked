// This component is used to ensure that a profile exists for the authenticated user. It makes a POST request to the /api/profile/ensure API route when the component mounts. The API route will check if a profile already exists for the user, and if not, it will create one with default values. This component can be included in any page or layout where you want to guarantee that the user's profile is set up before rendering the rest of the content.
// Note: This component does not handle loading states or errors. It simply fires and forgets the request to ensure the profile exists. You may want to enhance it with error handling or loading indicators as needed.

"use client";

import { useEffect } from "react";

// The EnsureProfile component is a client-side React component that uses the useEffect 
// hook to trigger a side effect when the component mounts. 
// In this case, the side effect is a fetch request to the /api/profile/ensure endpoint with the POST method. 
// This request is intended to ensure that a user profile exists for the authenticated user. 
// The component does not render any UI and returns null, as its sole purpose is to perform this side effect 
// when included in a page or layout.
export default function EnsureProfile() {
    useEffect(() => {
        fetch("/api/profile/ensure", { method: "POST" });
    }, []);

    return null;
}
