
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: "magic-link",
      name: "Magic Link",
      credentials: {
        email: { label: "Email", type: "email" }
      },
      async authorize(credentials) {
        // Mock magic link authentication
        if (credentials?.email) {
          return { id: "1", name: "FinPilot User", email: credentials.email };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "f1npil0t-poc-66778899-secret-key",
});

export { handler as GET, handler as POST };
