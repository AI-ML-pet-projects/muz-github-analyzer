import NextAuth, { Account, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "@/lib/supabase";

async function createOrUpdateUser(user: User, account: Account) {
  try {
    // Check if user already exists
    const { data: existingUsers, error: queryError } = await supabase
      .from("users")
      .select("id")
      .eq("email", user.email);

    if (queryError) {
      throw new Error(`Error checking existing user: ${queryError.message}`);
    }

    const existingUser = existingUsers?.[0];

    if (!existingUser) {
      // Create new user
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert([
          {
            email: user.email,
            name: user.name,
            image_url: user.image,
            provider: "google",
            provider_account_id: account.providerAccountId,
            last_sign_in: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (insertError) {
        throw new Error(`Error creating new user: ${insertError.message}`);
      }

      return { user: newUser, isNew: true };
    } else {
      // Update existing user's last sign in
      const { error: updateError } = await supabase
        .from("users")
        .update({ last_sign_in: new Date().toISOString() })
        .eq("id", existingUser.id);

      if (updateError) {
        throw new Error(`Error updating user: ${updateError.message}`);
      }

      return { user: existingUser, isNew: false };
    }
  } catch (error) {
    console.error("Error in createOrUpdateUser:", error);
    throw error;
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  events: {
    async signIn({ user, account }): Promise<void> {
      if (account?.provider === "google") {
        try {
          const result = await createOrUpdateUser(user, account);

          // Update the user object with Supabase ID
          if (result.user) {
            user.id = result.user.id;
          }
        } catch (error) {
          console.error("Authentication error:", error);
        }
      }
    },
  },
});

export { handler as GET, handler as POST };
