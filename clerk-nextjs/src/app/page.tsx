import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import EnsureProfile from "@/components/EnsureProfile";

export default function Page() {
    return (
        <div>
            <SignedOut>
                <SignInButton />
            </SignedOut>

            <SignedIn>
                <EnsureProfile />
                <p>You are signed in.</p>
            </SignedIn>
        </div>
    );
}
