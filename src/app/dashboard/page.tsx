"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiKeyModal } from "@/components/ApiKeyModal";
import { notify } from "@/utils/notifications";
import { ApiKeyTable } from "@/components/ApiKeyTable";
import { PlanCard } from "@/components/PlanCard";
import { useSession } from "next-auth/react";
import { ApiKey } from "@/lib/api/api-keys";

const fetchWithHeaders = async (url: string, options: RequestInit = {}) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.method !== "GET" ? { "X-CSRF-Protection": "1" } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.error || `Failed to ${options.method || "GET"} ${url}`
    );
  }

  return response;
};

export default function Dashboard() {
  const { status } = useSession();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [usage, setUsage] = useState<number>(0);
  const [showForm, setShowForm] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsage = useCallback(async () => {
    try {
      const response = await fetchWithHeaders("/api/usage");
      const data = await response.json();
      setUsage(data.usage);
    } catch (err) {
      console.error("Failed to fetch usage:", err);
      notify.error("Failed to fetch API usage");
    }
  }, []);

  const fetchKeys = useCallback(async () => {
    try {
      const response = await fetchWithHeaders("/api/api-keys");
      const keys = await response.json();
      setApiKeys(keys);
    } catch (err) {
      console.error("Failed to fetch API keys:", err);
      notify.apiKey.error("fetch");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      Promise.all([fetchKeys(), fetchUsage()]);
    }
  }, [status, fetchKeys, fetchUsage]);

  const handleToggleView = (id: string) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyId(id);
    notify.apiKey.copy();
    setTimeout(() => setCopiedKeyId(null), 1500);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this API key?")) {
      try {
        await fetchWithHeaders(`/api/api-keys/${id}`, {
          method: "DELETE",
        });
        notify.apiKey.delete();
        await Promise.all([fetchKeys(), fetchUsage()]);
      } catch (err) {
        console.error("Failed to delete API key:", err);
        notify.apiKey.error("delete");
      }
    }
  };

  const handleSubmit = async (formData: {
    name: string;
    type: "production" | "development";
    monthlyLimit?: number;
  }) => {
    try {
      if (editingKey) {
        await fetchWithHeaders(`/api/api-keys/${editingKey.id}`, {
          method: "PATCH",
          body: JSON.stringify(formData),
        });
        notify.apiKey.update();
      } else {
        await fetchWithHeaders("/api/api-keys", {
          method: "POST",
          body: JSON.stringify(formData),
        });
        notify.apiKey.create();
      }
      setShowForm(false);
      await Promise.all([fetchKeys(), fetchUsage()]);
    } catch (err) {
      console.error("Failed to handle API key operation:", err);
      notify.apiKey.error(editingKey ? "update" : "create");
    }
  };

  // Loading state
  if (status === "loading" || isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    );
  }

  // Not authenticated
  if (status === "unauthenticated") {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <h1 className='text-2xl font-bold mb-4'>Access Denied</h1>
        <p className='text-gray-600'>Please sign in to access the dashboard.</p>
      </div>
    );
  }

  return (
    <>
      <PlanCard plan='Researcher' usage={usage} limit={1000} />
      <ApiKeyTable
        apiKeys={apiKeys}
        visibleKeys={visibleKeys}
        copiedKeyId={copiedKeyId}
        onToggleView={handleToggleView}
        onCopy={handleCopy}
        onEdit={(key) => {
          setEditingKey(key);
          setShowForm(true);
        }}
        onDelete={handleDelete}
        onCreateNew={() => {
          setEditingKey(null);
          setShowForm(true);
        }}
      />
      <ApiKeyModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmit}
        editingKey={
          editingKey
            ? {
                name: editingKey.name,
                type: editingKey.type,
                monthlyLimit: editingKey.monthly_limit || undefined,
              }
            : null
        }
      />
    </>
  );
}
