import { NextRequest, NextResponse } from "next/server";
import { deleteApiKey, updateApiKey } from "@/lib/api/api-keys";
import {
  unauthorized,
  badRequest,
  serverError,
  getSessionUser,
} from "@/lib/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser();

  if (!user) {
    return unauthorized();
  }

  try {
    await deleteApiKey(user.id, params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete API key:", err);
    return serverError("Failed to delete API key");
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    await updateApiKey(user.id, params.id, {
      name: body.name,
      type: body.type as "production" | "development",
      monthlyLimit: body.monthlyLimit,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to update API key:", err);
    return serverError("Failed to update API key");
  }
}
