import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  currentUsage?: number;
}

export interface ApiKeyData {
  key: string;
  usage: number;
  monthly_limit: number | null;
  is_active: boolean;
}

/**
 * Extracts the API key from the request headers
 * Checks both x-api-key and Authorization headers
 */
export function extractApiKey(request: NextRequest): string | null {
  const xApiKey = request.headers.get("x-api-key");
  if (xApiKey) {
    return xApiKey;
  }

  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.replace("Bearer ", "");
  }

  return null;
}

/**
 * Validates an API key against the database
 */
export async function validateApiKey(
  apiKey: string
): Promise<ValidationResult> {
  try {
    const { data: keys, error } = await supabase
      .from("api_keys")
      .select("*")
      .eq("key", apiKey)
      .single();

    if (error || !keys) {
      return {
        isValid: false,
        error: "Invalid API key",
      };
    }

    // Check monthly usage limit if it exists
    if (keys.monthly_limit !== null && keys.usage >= keys.monthly_limit) {
      return {
        isValid: false,
        error: "Monthly usage limit exceeded",
      };
    }

    return {
      isValid: true,
      currentUsage: keys.usage,
    };
  } catch (error) {
    console.error("Error validating API key:", error);
    return {
      isValid: false,
      error: "Error validating API key",
    };
  }
}

/**
 * Updates the usage count for an API key
 */
export async function incrementApiKeyUsage(
  apiKey: string,
  currentUsage: number
): Promise<void> {
  try {
    await supabase
      .from("api_keys")
      .update({ usage: currentUsage + 1 })
      .eq("key", apiKey);
  } catch (error) {
    console.error("Error updating API key usage:", error);
    throw new Error("Failed to update API key usage");
  }
}
