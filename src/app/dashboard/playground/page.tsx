"use client";

import { useState } from "react";
import { notify } from "@/utils/notifications";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ApiResponse {
  summary: string;
  cool_facts: string[];
  url: string;
  type: string;
  readme: {
    format: string;
    wasTruncated: boolean;
  };
  metadata: {
    stars: number;
    latestVersion: string | null;
    description: string | null;
    topics: string[];
    updatedAt: string;
    websiteUrl: string | null;
    license: {
      key: string | null;
      name: string | null;
      url: string | null;
    };
  };
}

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [type, setType] = useState<"repository" | "issue" | "pull_request">(
    "repository"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!apiKey.trim()) {
      notify.error("Please enter an API key");
      return;
    }
    if (!githubUrl.trim()) {
      notify.error("Please enter a GitHub URL");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/github-summarizer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          githubUrl,
          type,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze repository");
      }

      setResponse(data);
      notify.success("Analysis completed successfully");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        notify.error(err.message);
      } else {
        setError("An unknown error occurred");
        notify.error("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container mx-auto py-8 space-y-8'>
      <div>
        <h1 className='text-3xl font-bold mb-2'>GitHub Repository Analyzer</h1>
        <p className='text-muted-foreground'>
          Analyze any GitHub repository to get insights, summaries, and
          metadata.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analysis Configuration</CardTitle>
          <CardDescription>
            Enter your API key and the GitHub repository URL to analyze.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium' htmlFor='apiKey'>
              API Key
            </label>
            <Input
              id='apiKey'
              type='password'
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder='Enter your API key'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium' htmlFor='githubUrl'>
              GitHub URL
            </label>
            <Input
              id='githubUrl'
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder='https://github.com/owner/repo'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Analysis Type</label>
            <Select
              value={type}
              onValueChange={(value: string) =>
                setType(value as "repository" | "issue" | "pull_request")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='repository'>Repository</SelectItem>
                <SelectItem value='issue'>Issue</SelectItem>
                <SelectItem value='pull_request'>Pull Request</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className='w-full'
            onClick={handleAnalyze}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Analyzing...
              </>
            ) : (
              "Analyze Repository"
            )}
          </Button>
        </CardContent>
      </Card>

      {response && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              Here&apos;s what we found about this repository
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue='summary' className='w-full'>
              <TabsList className='grid w-full grid-cols-3'>
                <TabsTrigger value='summary'>Summary</TabsTrigger>
                <TabsTrigger value='metadata'>Metadata</TabsTrigger>
                <TabsTrigger value='facts'>Cool Facts</TabsTrigger>
              </TabsList>

              <TabsContent value='summary' className='space-y-4'>
                <div className='mt-4 prose prose-sm max-w-none'>
                  <p className='text-muted-foreground'>{response.summary}</p>
                </div>
              </TabsContent>

              <TabsContent value='metadata' className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <p className='text-sm font-medium'>Stars</p>
                    <p className='text-2xl font-bold'>
                      {response.metadata.stars.toLocaleString()}
                    </p>
                  </div>
                  <div className='space-y-2'>
                    <p className='text-sm font-medium'>Latest Version</p>
                    <p className='text-2xl font-bold'>
                      {response.metadata.latestVersion || "N/A"}
                    </p>
                  </div>
                  {response.metadata.websiteUrl && (
                    <div className='col-span-2 space-y-2'>
                      <p className='text-sm font-medium'>Website</p>
                      <a
                        href={response.metadata.websiteUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-500 hover:underline'
                      >
                        {response.metadata.websiteUrl}
                      </a>
                    </div>
                  )}
                  <div className='col-span-2 space-y-2'>
                    <p className='text-sm font-medium'>License</p>
                    <p>{response.metadata.license.name || "No license"}</p>
                  </div>
                  <div className='col-span-2 space-y-2'>
                    <p className='text-sm font-medium'>Topics</p>
                    <div className='flex flex-wrap gap-2'>
                      {response.metadata.topics.map((topic) => (
                        <Badge key={topic} variant='secondary'>
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value='facts' className='space-y-4'>
                <ul className='space-y-4'>
                  {response.cool_facts.map((fact, index) => (
                    <li key={index} className='flex items-start gap-2'>
                      <CheckCircle2 className='h-5 w-5 text-green-500 mt-0.5' />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className='border-destructive'>
          <CardContent className='pt-6'>
            <div className='flex items-center gap-2 text-destructive'>
              <XCircle className='h-5 w-5' />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
