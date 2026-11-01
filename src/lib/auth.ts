import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { betterAuth } from "better-auth";
import { emailOTP, twoFactor, username } from "better-auth/plugins";
import { sendEmail } from "./sendEmail";
import { User } from "@prisma/client";

declare global {
    var authMongoClient: MongoClient | undefined;
}

const client =
    global.authMongoClient ??
    new MongoClient(process.env.DATABASE_URL!);

if (process.env.NODE_ENV !== "production") {
    global.authMongoClient = client;
}

const db = client.db();

export const auth = betterAuth({
    database: mongodbAdapter(db),

   trustedOrigins: [
    "http://localhost:3000",
    "https://*.vercel.app",
],

    plugins: [
        twoFactor({
            issuer: "Nexio",
            requirePassword: false,
        }),
        username(),
        emailOTP({
        async sendVerificationOTP({ email, otp,type }) {
            await sendEmail({
                to: email,
                subject: "Your Nexio verification code",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background-color: #f8fafc; border-radius: 20px;">
                        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px 24px; text-align: center;">
                        <div style="display: inline-block; background-color: #eef2ff; color: #4f46e5; font-size: 22px; font-weight: 800; padding: 12px 18px; border-radius: 12px; letter-spacing: -1px;">
                            Nexio
                        </div>

                        <h2 style="color: #0f172a; font-size: 24px; margin: 28px 0 12px; font-weight: 700;">
                            Verify your email
                        </h2>

                        <p style="color: #64748b; font-size: 14px; line-height: 1.7; margin: 0 0 28px;">
                            Use the verification code below to continue with your Nexio account.
                        </p>

                        <div style="background-color: #eef2ff; border: 1px solid #c7d2fe; border-radius: 12px; padding: 20px 12px; margin-bottom: 24px;">
                            <h1 style="color: #4f46e5; font-size: 32px; letter-spacing: 8px; margin: 0; font-weight: 800;">
                            ${otp}
                            </h1>
                        </div>

                        <p style="color: #64748b; font-size: 13px; line-height: 1.6; margin: 0;">
                            If you did not request this code, you can safely ignore this email.
                        </p>

                        <div style="height: 1px; background-color: #e2e8f0; margin: 28px 0 20px;"></div>

                        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                            &copy; Nexio · Connect with people who matter.
                        </p>
                        </div>
                    </div>
                    `,
            });
        },
    }),
    ],

    user: {
        additionalFields: {
            username: {
                type: "string",
                required: true,
                input: true,
            },
        },

        changeEmail: {
            enabled: true,
            sendChangeEmailVerification: async ({ user, newEmail, url }:{user:User,newEmail:string,url:string}) => {
                await sendEmail({
                    to: newEmail,
                    subject: "Verify your new Nexio email",
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 24px;">
                            <h2>Verify your new email</h2>
                            <p>Hello ${user.name},</p>
                            <p>Click below to confirm your new email address.</p>
                            <a href="${url}">Verify new email</a>
                            <p>If you did not request this change, you can ignore this email.</p>
                            <p>— Nexio</p>
                        </div>
                    `,
                });
            },
        },
    },

    emailAndPassword: {
        enabled: true,
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },


    // rate limiting to protect pages from spam requests!
    rateLimit: {
        enabled: true,
        window: 60,
        max: 100,
        customRules: {
            "/sign-in/email": {
                window: 60,
                max: 10,
            },
            "/sign-up/email": {
                window: 60,
                max: 5,
            },
            "/email-otp/send-verification-otp": {
                window: 600,
                max: 3,
            },
            "/email-otp/verify-email": {
                window: 300,
                max: 5,
            },
            "/email-otp/reset-password": {
                window: 300,
                max: 5,
            },
        },
    },
});