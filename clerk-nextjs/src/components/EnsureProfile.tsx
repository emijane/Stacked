"use client";

import { useEffect } from "react";

export default function EnsureProfile() {
    useEffect(() => {
        fetch("/api/profile/ensure", { method: "POST" });
    }, []);

    return null;
}
