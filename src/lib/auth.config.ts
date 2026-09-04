import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config: no providers with Node-only dependencies
 * (mongoose/bcrypt) so this can run inside middleware. The Credentials
 * provider (which needs the database) is added on top of this in
 * `auth.ts`, which only runs in the Node.js runtime (API routes, server
 * components).
 */
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
