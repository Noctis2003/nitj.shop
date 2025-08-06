import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "your-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "your-google-client-secret",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "your-nextauth-secret",
  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        return false; // Reject sign in if no email
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        // Create a new user if they don't exist
        await prisma.user.create({
          data: {
            username: user.name || "Anonymous",
            email: user.email,
          },
        });
      }

      return true;
    }
  }
});

export { handler as GET, handler as POST };
