import Image from "next/image";
import Link from "next/link";

export default function Page() {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-black/18"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 shadow-[inset_0_0_180px_rgba(0,0,0,0.55)]"
            />
            <div className="relative flex max-w-3xl flex-col items-center gap-6 sm:gap-7">
                <div className="rounded-full border border-[#e23d39]/30 bg-white/[0.025] px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-white/62 shadow-[0_0_18px_rgba(226,61,57,0.14)]">
                    Beta Testing Coming Soon
                </div>
                <div className="flex items-end gap-3.5 sm:gap-4">
                    <Image
                        src="/kitty-red-cross-white-border.png"
                        alt=""
                        width={58}
                        height={58}
                        className="h-[2.9rem] w-[2.9rem] shrink-0 drop-shadow-[0_0_8px_rgba(255,68,68,0.14)] sm:h-[68px] sm:w-[68px]"
                        priority
                    />
                    <h1 className="text-center text-[3rem] font-semibold leading-none tracking-[-0.075em] text-white sm:text-[5.25rem]">
                        <span>overclock</span>
                        <span className="ml-[0.04em] text-white/64 sm:text-[0.91em]">.lol</span>
                    </h1>
                </div>
                <p className="max-w-[34rem] text-center text-[15px] font-normal leading-[1.38] text-white/70 sm:text-lg">
                    No more randoms. No more wasted games.
                    <br />
                    Find Overwatch players who match your skill, role, and mindset.
                </p>
                <div className="mt-1 flex items-center gap-2.5">
                    <a
                        href="https://discord.gg/8ZKUUjMtG"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10.5 items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.035] px-4.5 text-sm font-semibold text-white transition-[background-color,border-color,box-shadow] hover:border-white/[0.12] hover:bg-white/[0.06] hover:shadow-[0_0_18px_rgba(255,255,255,0.03)]"
                    >
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className="h-4 w-4 shrink-0 fill-current text-white/92"
                        >
                            <path d="M20.317 4.369A19.791 19.791 0 0 0 15.885 3c-.191.328-.403.769-.554 1.116a18.27 18.27 0 0 0-6.658 0A11.64 11.64 0 0 0 8.12 3a19.736 19.736 0 0 0-4.437 1.372C.873 8.583.106 12.691.489 16.742a19.9 19.9 0 0 0 5.993 3.03c.486-.665.918-1.37 1.287-2.108a12.936 12.936 0 0 1-2.024-.977c.17-.125.337-.255.499-.389 3.905 1.838 8.148 1.838 12.007 0 .165.134.332.264.499.389a12.88 12.88 0 0 1-2.028.978c.37.737.801 1.442 1.287 2.107a19.86 19.86 0 0 0 5.997-3.03c.451-4.698-.769-8.769-3.692-12.373ZM8.02 14.323c-1.182 0-2.156-1.085-2.156-2.419 0-1.333.955-2.418 2.156-2.418 1.21 0 2.175 1.095 2.156 2.418 0 1.334-.955 2.419-2.156 2.419Zm7.975 0c-1.182 0-2.156-1.085-2.156-2.419 0-1.333.955-2.418 2.156-2.418 1.21 0 2.175 1.095 2.156 2.418 0 1.334-.946 2.419-2.156 2.419Z" />
                        </svg>
                        <span>Join Our Discord</span>
                    </a>
                    <a
                        href="https://x.com/overclocklol"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Follow overclocklol on X"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02] text-white/72 transition-[background-color,border-color,color,box-shadow] hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-white hover:shadow-[0_0_18px_rgba(255,255,255,0.03)]"
                    >
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className="h-4.5 w-4.5 fill-current"
                        >
                            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.64 7.584H.472l8.6-9.83L0 1.153h7.594l5.243 6.932zM17.61 20.645h2.039L6.486 3.24H4.298z" />
                        </svg>
                    </a>
                </div>
            </div>
            <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-center">
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm font-medium leading-5">
                    <p className="text-transparent bg-gradient-to-r from-slate-100 via-zinc-100 to-slate-300 bg-clip-text drop-shadow-[0_0_10px_rgba(255,255,255,0.12)]">
                        developed by{" "}
                        <Link
                            href="https://x.com/pcexplodes"
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-transparent bg-gradient-to-r from-white via-slate-100 to-zinc-200 bg-clip-text transition-all hover:from-white hover:via-white hover:to-slate-100"
                        >
                            emi
                        </Link>
                    </p>
                    <span className="text-white/28">/</span>
                    <p className="text-transparent bg-gradient-to-r from-orange-100 via-rose-100 to-pink-100 bg-clip-text drop-shadow-[0_0_14px_rgba(251,113,133,0.4)]">
                        logo art by{" "}
                        <Link
                            href="https://ioananenciu.carrd.co/"
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-transparent bg-gradient-to-r from-white via-rose-100 to-orange-100 bg-clip-text transition-all hover:from-white hover:via-white hover:to-rose-100"
                        >
                            neo ˃ 𖥦 ˂
                        </Link>
                    </p>
                </div>
                <p className="text-xs font-medium tracking-[0.08em] text-white/38">
                    © 2026 overclock.lol. All rights reserved.
                </p>
            </div>
        </main>
    );
}
