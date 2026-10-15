import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { betterAuth } from "better-auth";
import { twoFactor } from "better-auth/plugins";
import { username } from "better-auth/plugins";

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
    process.env.NEXT_PUBLIC_APP_URL!,
    "https://*.vercel.app",
  ],
  plugins: [
    twoFactor({
      issuer: "Nexio",
      requirePassword: false,
    }),
  ],
  user:{
    additionalFields:{
      username:{
        type: 'string',
        required: true,
        input: true
      }
    }
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
});