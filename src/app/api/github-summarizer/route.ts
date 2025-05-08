import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import {
  extractApiKey,
  validateApiKey,
  incrementApiKeyUsage,
} from "@/utils/apiKeyUtils";
import { getGitHubReadme, generateRepoSummary } from "@/utils/githubUtils";

// Input validation schema
const RequestSchema = z.object({
  githubUrl: z.string().url().startsWith("https://github.com/"),
  type: z.enum(["repository", "issue", "pull_request"]).default("repository"),
});

export async function POST(request: NextRequest) {
  try {
    // Extract and validate API key
    const apiKey = extractApiKey(request);
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Missing API key. Please provide it in the x-api-key header or Authorization Bearer token.",
        },
        { status: 401 }
      );
    }

    const validationResult = await validateApiKey(apiKey);
    if (!validationResult.isValid) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const result = RequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: result.error.issues },
        { status: 400 }
      );
    }

    const { githubUrl, type } = result.data;

    try {
      // Fetch README content
      let readmeInfo;
      try {
        readmeInfo = await getGitHubReadme(githubUrl);
      } catch (readmeError) {
        console.warn("Could not fetch README:", readmeError);
        return NextResponse.json(
          { error: "Could not fetch repository README" },
          { status: 404 }
        );
      }

      // Generate repository summary
      const analysis = await generateRepoSummary(readmeInfo);

      // Update API key usage
      if (validationResult.currentUsage !== undefined) {
        await incrementApiKeyUsage(apiKey, validationResult.currentUsage);
      }

      return NextResponse.json({
        ...analysis,
        url: githubUrl,
        type,
        readme: {
          format: readmeInfo.format,
          wasTruncated: readmeInfo.wasTruncated,
        },
        metadata: readmeInfo.metadata,
      });
    } catch (aiError) {
      console.error("Analysis error:", aiError);
      return NextResponse.json(
        { error: "Error analyzing repository" },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Error in github-summarizer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
