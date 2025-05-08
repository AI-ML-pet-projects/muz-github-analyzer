import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSessionUser, unauthorized, serverError } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return unauthorized();
  }

  try {
    const { data, error } = await supabase
      .from("api_keys")
      .select("usage")
      .eq("user_id", user.id);

    if (error) {
      throw new Error(`Failed to fetch usage: ${error.message}`);
    }

    const totalUsage =
      data?.reduce((sum, key) => sum + (key.usage || 0), 0) || 0;

    return NextResponse.json({ usage: totalUsage });
  } catch (err) {
    console.error("Failed to fetch API usage:", err);
    return serverError("Failed to fetch API usage");
  }
}
