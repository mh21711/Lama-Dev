import User from "@/models/User";
import connect from "@/utils/db";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials"; // Import CredentialsProvider

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      async authorize(credentials) {
        await connect();

        try {
          const user = await User.findOne({ email: credentials.email });

          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password
            );

            if (isPasswordCorrect) {
              return user;
            } else {
              throw new Error("Password Is Wrong");
            }
          } else {
            throw new Error("User Not Found");
          }
        } catch (err) {
          throw new Error(err);
        }
      },
    }),
  ],
  pages: {
    error: "/dashboard/login",
  },
});

export { handler as GET, handler as POST };
