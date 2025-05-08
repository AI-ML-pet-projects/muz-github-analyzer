import { NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api/api-keys";

export async function POST(request: Request) {
  try {
    // Check if API key is provided in Authorization header
    const authHeader = request.headers.get("Authorization");
    let apiKey: string | undefined;

    if (authHeader?.startsWith("Bearer ")) {
      apiKey = authHeader.substring(7);
    } else {
      // If not in header, try body
      const body = await request.json();
      apiKey = body.apiKey;
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 401 }
      );
    }

    const result = await validateApiKey(apiKey);

    if (!result.isValid) {
      return NextResponse.json(
        { error: result.error },
        {
          status:
            result.error === "API key has exceeded its monthly limit"
              ? 403
              : 401,
        }
      );
    }

    return NextResponse.json({
      message: "API key is valid",
      data: result.data,
    });
  } catch (error) {
    console.error("Error validating API key:", error);
    return NextResponse.json(
      { error: "An error occurred while validating the API key" },
      { status: 500 }
    );
  }
}
