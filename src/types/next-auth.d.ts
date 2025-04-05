import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    /** The user's name */
    name: string;
    /** The user's email address */
    email: string;
    /** The user's profile image URL */
    image: string;
    /** The user's  address. */
    status: "customer" | "admin" | "seller";
  }
  interface Session {
    user: {
      /** The user's  address. */
      status: "customer" | "admin" | "seller";
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}
