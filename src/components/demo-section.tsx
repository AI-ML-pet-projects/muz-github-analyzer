"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Play,
  FileText,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";

interface ApiResponse {
  summary?: string;
  cool_facts?: string[];
  url?: string;
  type?: string;
  readme?: {
    format: string;
    wasTruncated: boolean;
  };
  error?: string;
}

const mockResponse = {
  summary:
    "GPT Researcher is an autonomous agent designed to perform comprehensive research on any given topic.",
  cool_facts: [
    "Uses GPT-4 for analysis",
    "Supports multiple research strategies",
    "Can generate research reports",
  ],
  url: "https://github.com/assafelovic/gpt-researcher",
  type: "repository",
  readme: {
    format: "markdown",
    wasTruncated: false,
  },
};

export default function DemoSection() {
  const defaultPayload = JSON.stringify(
    {
      githubUrl: "https://github.com/assafelovic/gpt-researcher",
      type: "repository",
    },
    null,
    2
  );

  const [payload, setPayload] = useState(defaultPayload);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("request");
  const [copied, setCopied] = useState(false);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [requestCount, setRequestCount] = useState(0);
  const MAX_REQUESTS = 2;

  const handleSubmit = async () => {
    if (requestCount >= MAX_REQUESTS) {
      setError(
        "You have reached the maximum number of demo requests. Please sign up for an API key to continue."
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    setActiveTab("response");

    try {
      const parsedPayload = JSON.parse(payload);
      const startTime = performance.now();

      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const response = await fetch(`${baseUrl}/api/github-summarizer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": process.env.NEXT_PUBLIC_DEMO_API_KEY || "",
        },
        body: JSON.stringify(parsedPayload),
      });

      const endTime = performance.now();
      setResponseTime(Math.round((endTime - startTime) * 100) / 100);
      setStatusCode(response.status);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResponse(data);
      setRequestCount((prev) => prev + 1);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Invalid JSON payload. Please check your syntax.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }

      // For demo purposes, show mock response if API is not available
      if (
        !window.location.origin.includes("localhost") &&
        !error?.includes("JSON")
      ) {
        setResponse(mockResponse);
        setStatusCode(200);
        setResponseTime(950);
        setRequestCount((prev) => prev + 1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefault = () => {
    setPayload(defaultPayload);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>API Demo</CardTitle>
        <CardDescription>
          Try out the API with our demo interface. Limited to {MAX_REQUESTS}{" "}
          requests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value='request' disabled={isLoading}>
              Request
            </TabsTrigger>
            <TabsTrigger value='response' disabled={isLoading}>
              Response
              {statusCode && (
                <Badge
                  variant={statusCode === 200 ? "default" : "destructive"}
                  className='ml-2'
                >
                  {statusCode}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value='request'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <h4 className='text-sm font-medium'>Request Payload</h4>
                  <p className='text-sm text-gray-500'>
                    Edit the JSON payload to customize your request
                  </p>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={resetToDefault}
                  disabled={isLoading}
                >
                  Reset
                </Button>
              </div>
              <div className='relative'>
                <Textarea
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  className='font-mono'
                  rows={10}
                  disabled={isLoading}
                />
                {isLoading && (
                  <div className='absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center'>
                    <div className='flex flex-col items-center gap-2'>
                      <Loader2 className='h-6 w-6 animate-spin text-primary' />
                      <p className='text-sm text-muted-foreground'>
                        Processing request...
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className='flex justify-between items-center'>
                <div className='text-sm text-gray-500'>
                  {requestCount} of {MAX_REQUESTS} requests used
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || requestCount >= MAX_REQUESTS}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Play className='mr-2 h-4 w-4' />
                      Send Request
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value='response'>
            <div className='space-y-4'>
              {error ? (
                <div className='flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-md'>
                  <AlertCircle className='h-4 w-4' />
                  <p className='text-sm'>{error}</p>
                </div>
              ) : isLoading ? (
                <div className='flex flex-col items-center justify-center py-12 gap-3'>
                  <Loader2 className='h-8 w-8 animate-spin text-primary' />
                  <div className='text-sm text-muted-foreground'>
                    Processing your request...
                    {responseTime && (
                      <span className='ml-2 text-xs'>
                        ({responseTime}ms elapsed)
                      </span>
                    )}
                  </div>
                </div>
              ) : response ? (
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='space-x-2'>
                      {statusCode && (
                        <Badge
                          variant={
                            statusCode === 200 ? "default" : "destructive"
                          }
                        >
                          Status: {statusCode}
                        </Badge>
                      )}
                      {responseTime && (
                        <Badge variant='outline'>Time: {responseTime}ms</Badge>
                      )}
                    </div>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        copyToClipboard(JSON.stringify(response, null, 2))
                      }
                    >
                      {copied ? (
                        <>
                          <Check className='mr-2 h-4 w-4' />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className='mr-2 h-4 w-4' />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <Textarea
                    value={JSON.stringify(response, null, 2)}
                    readOnly
                    className='font-mono'
                    rows={10}
                  />
                </div>
              ) : (
                <div className='text-center py-8 text-gray-500'>
                  <FileText className='mx-auto h-12 w-12 opacity-50' />
                  <p className='mt-2'>Send a request to see the response</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className='text-sm text-gray-500'>
        {requestCount >= MAX_REQUESTS ? (
          <p>
            You have used all your demo requests. Please{" "}
            <a href='/signup' className='text-blue-500 hover:underline'>
              sign up
            </a>{" "}
            to get your API key.
          </p>
        ) : (
          <p>
            {MAX_REQUESTS - requestCount} demo requests remaining. Sign up to
            get your API key.
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
