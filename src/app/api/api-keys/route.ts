import { NextRequest, NextResponse } from "next/server";
import { createApiKey, fetchApiKeys } from "@/lib/api/api-keys";
import {
  unauthorized,
  badRequest,
  serverError,
  getSessionUser,
} from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return unauthorized();
  }

  try {
    const apiKeys = await fetchApiKeys(user.id);
    return NextResponse.json(apiKeys);
  } catch (err) {
    console.error("Failed to fetch API keys:", err);
    return serverError("Failed to fetch API keys");
  }
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();

  if (!user) {
    return unauthorized();
  }

  try {
    const body = await request.json();

    // Validate request body
    if (
      !body.name ||
      !body.type ||
      !["production", "development"].includes(body.type)
    ) {
      return badRequest("Invalid request body");
    }

    await createApiKey(user.id, {
      name: body.name,
      type: body.type as "production" | "development",
      monthlyLimit: body.monthlyLimit,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to create API key:", err);
    return serverError("Failed to create API key");
  }
}
