import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { firestore } from "./firebase/admin";
import admin from "firebase-admin";
import { CustomFirestoreAdapter } from "./firebase/custom-adapter";
import { cache } from "react";
import { signInWithCustomToken } from "firebase/auth";
import { firebaseAuth } from "./firebase/init";

const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: CustomFirestoreAdapter(firestore),
  // adapter: FirestoreAdapter(firestore),
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // console.log("user inside jwt callback", user);
      // console.log("token inside jwt callback", token);
      // user is the user obtained from the database
      if (user) {
        // Create a custom token using the user's ID from NextAuth
        const firebaseToken = await admin
          .auth()
          .createCustomToken(user.id as string);

        // Sign in to Firebase using the custom token
        const firebaseUser = await signInWithCustomToken(
          firebaseAuth,
          firebaseToken
        );
        // If user is not signed in or firebaseUser is undefined, throw an error
        if (!firebaseUser.user) {
          throw new Error("Failed to sign in with custom token");
        }
        token.sub = user.id;
        token.status = user.status;
      }
      return token;
    },
    session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub as string;
        session.user.status = token.status as "customer" | "admin" | "seller";
      }
      // console.log("this is session", session);
      // console.log("this is token", token);
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
export { handlers, signIn, signOut };
export const getAuth = cache(auth);
