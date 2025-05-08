import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";
import { z } from "zod";

// Types
export type ApiKey = Database["public"]["Tables"]["api_keys"]["Row"];

export interface ApiKeyCreateData {
  name: string;
  type: "production" | "development";
  monthlyLimit?: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ApiKeyUpdateData extends ApiKeyCreateData {}

export interface ApiKeyValidationResult {
  isValid: boolean;
  data?: {
    id: string;
    name: string;
    type: "production" | "development";
    monthlyLimit?: number;
    usage: number;
    remaining?: number | null;
  };
  error?: string;
}

// Validation schema
export const apiKeySchema = z.object({
  apiKey: z
    .string()
    .refine(
      (key) => key.startsWith("muz-prod-") || key.startsWith("muz-dev-"),
      "Invalid API key format"
    ),
});

// Server-side API functions
export async function fetchApiKeys(userId: string) {
  const { data, error } = await supabase
    .from("api_keys")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch API keys: ${error.message}`);
  }

  return data || [];
}

export async function deleteApiKey(userId: string, keyId: string) {
  const { error } = await supabase
    .from("api_keys")
    .delete()
    .eq("id", keyId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to delete API key: ${error.message}`);
  }
}

export async function createApiKey(userId: string, data: ApiKeyCreateData) {
  const keyData = {
    name: data.name,
    type: data.type,
    monthly_limit: data.monthlyLimit || 1000,
    key:
      data.type === "production"
        ? `muz-prod-${Math.random().toString(36).substring(2)}`
        : `muz-dev-${Math.random().toString(36).substring(2)}`,
    usage: 0,
    user_id: userId,
  };

  const { error } = await supabase.from("api_keys").insert([keyData]);

  if (error) {
    throw new Error(`Failed to create API key: ${error.message}`);
  }
}

export async function updateApiKey(
  userId: string,
  keyId: string,
  data: ApiKeyUpdateData
) {
  const keyData = {
    name: data.name,
    type: data.type,
    monthly_limit: data.monthlyLimit || null,
  };

  const { error } = await supabase
    .from("api_keys")
    .update(keyData)
    .eq("id", keyId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to update API key: ${error.message}`);
  }
}

export async function validateApiKey(
  apiKey: string
): Promise<ApiKeyValidationResult> {
  try {
    // Validate API key format
    const result = apiKeySchema.safeParse({ apiKey });
    if (!result.success) {
      return {
        isValid: false,
        error: result.error.issues[0].message,
      };
    }

    // Check if API key exists in database
    const { data, error } = await supabase
      .from("api_keys")
      .select("id, name, type, monthly_limit, usage")
      .eq("key", apiKey)
      .single();

    if (error || !data) {
      return {
        isValid: false,
        error: "Invalid API key",
      };
    }

    // Check if API key has exceeded its monthly limit
    if (data.monthly_limit && data.usage >= data.monthly_limit) {
      return {
        isValid: false,
        error: "API key has exceeded its monthly limit",
      };
    }

    return {
      isValid: true,
      data: {
        id: data.id,
        name: data.name,
        type: data.type,
        monthlyLimit: data.monthly_limit,
        usage: data.usage,
        remaining: data.monthly_limit ? data.monthly_limit - data.usage : null,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      isValid: false,
      error: "An error occurred while validating the API key",
    };
  }
}

// Client-side API functions
const fetchWithHeaders = async (url: string, options: RequestInit = {}) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    // Add CSRF protection for mutations
    ...(options.method !== "GET" ? { "X-CSRF-Protection": "1" } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Important for sending cookies
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.error || `Failed to ${options.method || "GET"} ${url}`
    );
  }

  return response;
};

export async function fetchUserApiKeys() {
  const response = await fetchWithHeaders("/api/api-keys");
  return response.json();
}

export async function deleteUserApiKey(keyId: string) {
  await fetchWithHeaders(`/api/api-keys/${keyId}`, {
    method: "DELETE",
  });
}

export async function createUserApiKey(data: ApiKeyCreateData) {
  await fetchWithHeaders("/api/api-keys", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateUserApiKey(keyId: string, data: ApiKeyUpdateData) {
  await fetchWithHeaders(`/api/api-keys/${keyId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function validateUserApiKey(apiKey: string) {
  const response = await fetchWithHeaders("/api/validate-key", {
    method: "POST",
    body: JSON.stringify({ apiKey }),
  });
  return response.json();
}
