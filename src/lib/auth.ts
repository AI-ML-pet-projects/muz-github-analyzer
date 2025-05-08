import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function getSessionUser() {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return null;
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("id")
    .eq("email", session.user.email)
    .single();

  if (error || !user) {
    return null;
  }

  return user;
}

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function serverError(message = "Internal Server Error") {
  return NextResponse.json({ error: message }, { status: 500 });
}

export function success<T>(data: T) {
  return NextResponse.json(data);
}
