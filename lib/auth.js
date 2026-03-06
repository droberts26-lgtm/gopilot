import GoogleProvider from 'next-auth/providers/google';

/**
 * NextAuth.js configuration.
 * Uses Google OAuth with JWT sessions — no database required.
 * User identity (name, email, image) is stored in a signed cookie.
 */
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  // Redirect back to the app after sign-in (not the default /api/auth/signin page)
  pages: {
    signIn: '/',
  },

  // Expose the Google account ID in the client session for use as a KV key
  callbacks: {
    session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
};
