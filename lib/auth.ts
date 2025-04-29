import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        try {
          // Dynamically import to avoid Next.js build issues
          const { connectToDatabase } = await import("@/lib/db");
          const User = (await import("@/models/user")).default;
          await connectToDatabase();
          // Find user by email (password is select: false by default)
          const user = await User.findOne({ email: credentials.email.toLowerCase().trim() }).select("+password");
          if (!user) return null;
          // Compare password
          const isMatch = await (user.comparePassword
            ? user.comparePassword(credentials.password)
            : (await import("bcryptjs")).compare(credentials.password, user.password));
          if (!isMatch) return null;
          // Return user info for session
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin || false,
          };
        } catch (err) {
          console.error("NextAuth authorize error:", err);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  }
}

export default authOptions