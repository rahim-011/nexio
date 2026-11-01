
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createHmac } from "node:crypto";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const secret = process.env.SOCKET_TOKEN_SECRET;

        if (!secret) {
            throw new Error("SOCKET_TOKEN_SECRET is missing");
        }

        const payload = {
            sub: session.user.id,
            exp: Math.floor(Date.now() / 1000) + 60,
            aud: "nexio-socket",
        };

        const payloadPart = Buffer
            .from(JSON.stringify(payload))
            .toString("base64url");

        const signature = createHmac("sha256", secret)
            .update(payloadPart)
            .digest("base64url");

        const token = `${payloadPart}.${signature}`;

        return NextResponse.json(
            { token },
            {
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );
    } catch (error) {
        console.error("Socket token error:", error);

        return NextResponse.json(
            { error: "Failed to generate socket token" },
            { status: 500 }
        );
    }
}
