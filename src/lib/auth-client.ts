import { createAuthClient } from "better-auth/react";
import { adminClient, emailOTPClient, twoFactorClient } from "better-auth/client/plugins";



export const authClient = createAuthClient({
    baseURL: typeof window !== "undefined" ? window.location.origin : process.env.APP_URL,
    plugins: [
        adminClient(),
        emailOTPClient(),
        twoFactorClient(),
    ],
});

export const { signIn, signUp, useSession } = authClient;