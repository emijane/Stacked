"use client";

import React, { useMemo, useState } from "react";

// The ProfileSettingsForm component is a presentational component that renders the form for editing the user's 
// profile settings.
export type Region = "NA" | "EU" | "APAC";
export type Role = "Tank" | "DPS" | "Support";
export type Platform = "PC" | "Console";

// The ProfileFormValues type defines the shape of the form values for the profile settings form.
export type ProfileFormValues = {
    bio: string;
    region: Region;
    timezone: string;
    currentRank: string;
    mainRole: Role;
    platformPC: boolean;
    platformConsole: boolean;
    isLft: boolean;
};

// The Props type defines the props that the ProfileSettingsForm component expects to receive.
type Props = {
    loading: boolean;
    saving: boolean;
    error: string | null;
    success: string | null;

    handle: string;
    displayName: string;

    values: ProfileFormValues;
    onChange: (next: ProfileFormValues) => void;

    onSave: () => void;
};

// The ProfileSettingsForm component renders a form for editing the user's profile settings. 
// It displays the current username and display name, and allows the user to edit their bio, region, 
// timezone, current rank, main role, platforms, and whether they are looking for a team (LFT). 
// It also shows loading, error, and success states based on the props it receives.
export default function ProfileSettingsForm(props: Props) {
    const selectedPlatforms: Platform[] = useMemo(() => {
        const out: Platform[] = [];
        if (props.values.platformPC) out.push("PC");
        if (props.values.platformConsole) out.push("Console");
        return out;
    }, [props.values.platformPC, props.values.platformConsole]);

    // If the component is in a loading state, we render a simple loading message.
    if (props.loading) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-semibold">Player Profile</h1>
                <p className="mt-2 opacity-80">Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl">
            <h1 className="text-2xl font-semibold text-red-500">Player Profile</h1>
            <p className="mt-2 opacity-80">
                Manage your profile settings.
            </p>

            <div className="mt-4 rounded-md border border-white/10 bg-white/5 p-3 text-sm">
                <div className="flex flex-col gap-1">
                    <div>
                        <span className="opacity-70">Username:</span>{" "}
                        <span className="font-mono">@{props.handle || "unknown"}</span>
                    </div>
                    <div>
                        <span className="opacity-70">Name:</span>{" "}
                        <span>{props.displayName || "Unknown"}</span>
                    </div>
                    <div className="opacity-70">
                        To change these, visit Account settings.
                    </div>
                </div>
            </div>

            {props.error && (
                <div className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm">
                    {props.error}
                </div>
            )}

            {props.success && (
                <div className="mt-4 rounded-md border border-green-500/40 bg-green-500/10 p-3 text-sm">
                    {props.success}
                </div>
            )}

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    props.onSave();
                }}
                className="mt-6 space-y-5"
            >
                <div>
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <textarea
                        value={props.values.bio}
                        onChange={(e) =>
                            props.onChange({ ...props.values, bio: e.target.value })
                        }
                        placeholder="Support main looking for a ranked duo..."
                        className="w-full min-h-[100px] rounded-md border border-white/10 bg-black/20 px-3 py-2 outline-none"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Region</label>
                        <select
                            value={props.values.region}
                            onChange={(e) =>
                                props.onChange({
                                    ...props.values,
                                    region: e.target.value as Region,
                                })
                            }
                            className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 outline-none"
                        >
                            <option value="NA">NA</option>
                            <option value="EU">EU</option>
                            <option value="APAC">APAC</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Timezone</label>
                        <input
                            value={props.values.timezone}
                            onChange={(e) =>
                                props.onChange({
                                    ...props.values,
                                    timezone: e.target.value,
                                })
                            }
                            placeholder="(optional for now)"
                            className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 outline-none"
                        />
                        <p className="mt-1 text-xs opacity-70">You can leave this blank for now.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Current Rank</label>
                        <select
                            value={props.values.currentRank}
                            onChange={(e) =>
                                props.onChange({
                                    ...props.values,
                                    currentRank: e.target.value,
                                })
                            }
                            className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 outline-none"
                        >
                            <option value="Unranked">Unranked</option>
                            <option value="Bronze">Bronze</option>
                            <option value="Silver">Silver</option>
                            <option value="Gold">Gold</option>
                            <option value="Platinum">Platinum</option>
                            <option value="Diamond">Diamond</option>
                            <option value="Masters">Masters</option>
                            <option value="Grandmaster">Grandmaster</option>
                            <option value="Champion">Champion</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Main Role</label>
                        <select
                            value={props.values.mainRole}
                            onChange={(e) =>
                                props.onChange({
                                    ...props.values,
                                    mainRole: e.target.value as Role,
                                })
                            }
                            className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 outline-none"
                        >
                            <option value="Tank">Tank</option>
                            <option value="DPS">DPS</option>
                            <option value="Support">Support</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Platforms</label>
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={props.values.platformPC}
                                onChange={(e) =>
                                    props.onChange({
                                        ...props.values,
                                        platformPC: e.target.checked,
                                    })
                                }
                            />
                            PC
                        </label>

                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={props.values.platformConsole}
                                onChange={(e) =>
                                    props.onChange({
                                        ...props.values,
                                        platformConsole: e.target.checked,
                                    })
                                }
                            />
                            Console
                        </label>
                    </div>
                </div>

                <div>
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={props.values.isLft}
                            onChange={(e) =>
                                props.onChange({
                                    ...props.values,
                                    isLft: e.target.checked,
                                })
                            }
                        />
                        Looking for team (LFT)
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={props.saving}
                    className="rounded-md border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15 disabled:opacity-60"
                >
                    {props.saving ? "Saving..." : "Save Profile"}
                </button>

                <div className="text-xs opacity-70">
                    Selected platforms: {selectedPlatforms.length ? selectedPlatforms.join(", ") : "None"}
                </div>
            </form>
        </div>
    );
}
