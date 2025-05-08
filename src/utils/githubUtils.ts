/**
 * Utility functions for interacting with GitHub
 */

import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

// Constants
const MAX_CONTENT_LENGTH = 8000; // Conservative limit to ensure we stay within token bounds
const README_FORMATS = [
  "README.md",
  "README.markdown",
  "README.mdown",
  "README.mkd",
  "README.rst",
  "README.adoc",
  "README.asciidoc",
  "README.txt",
  "README",
  "Readme.md",
  "readme.md",
];

// Output type definitions
export interface RepoAnalysis {
  summary: string;
  cool_facts: string[];
}

export interface RepoMetadata {
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
}

// Validation schemas
const repoAnalysisSchema = z.object({
  summary: z
    .string()
    .min(10, "Summary must be at least 10 characters")
    .max(1000, "Summary must not exceed 1000 characters")
    .describe("A concise but informative summary of the repository"),
  cool_facts: z
    .array(z.string())
    .min(2, "Must provide at least 2 cool facts")
    .max(4, "Cannot provide more than 4 cool facts")
    .describe(
      "2-4 interesting/unique and non-obvious facts about the repository that aren't easily found in the README"
    )
    .refine(
      (facts) => facts.every((fact) => fact.length >= 10),
      "Each fact must be at least 10 characters long"
    ),
});

/**
 * Truncates content to a reasonable size while maintaining readability
 * @param content - The content to truncate
 * @returns Truncated content with indication if it was truncated
 */
function truncateContent(content: string): {
  content: string;
  wasTruncated: boolean;
} {
  if (content.length <= MAX_CONTENT_LENGTH) {
    return { content, wasTruncated: false };
  }

  // Try to truncate at a paragraph break
  const truncated = content
    .slice(0, MAX_CONTENT_LENGTH)
    .split("\n\n")
    .slice(0, -1)
    .join("\n\n");

  return {
    content: truncated + "\n\n[Content truncated due to length...]",
    wasTruncated: true,
  };
}

/**
 * Attempts to fetch a file from a GitHub repository
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param branch - Branch name
 * @param path - File path
 * @returns Response from GitHub or null if not found
 */
async function fetchGitHubFile(
  owner: string,
  repo: string,
  branch: string,
  path: string
): Promise<Response | null> {
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    });
    return response.ok ? response : null;
  } catch (error) {
    console.warn(`Failed to fetch ${path} from ${branch}:`, error);
    return null;
  }
}

/**
 * Fetches repository metadata from GitHub API
 * @param owner - Repository owner
 * @param repo - Repository name
 * @returns Promise containing repository metadata
 */
export async function getRepoMetadata(
  owner: string,
  repo: string
): Promise<RepoMetadata> {
  try {
    // Fetch repository info
    const repoResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
      }
    );

    if (!repoResponse.ok) {
      throw new Error(
        `Failed to fetch repository info: ${repoResponse.statusText}`
      );
    }

    const repoData = await repoResponse.json();

    // Fetch latest release
    const releaseResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
      }
    );

    let latestVersion = null;
    if (releaseResponse.ok) {
      const releaseData = await releaseResponse.json();
      latestVersion = releaseData.tag_name;
    }

    return {
      stars: repoData.stargazers_count,
      latestVersion,
      description: repoData.description,
      topics: repoData.topics || [],
      updatedAt: repoData.updated_at,
      websiteUrl: repoData.homepage || null,
      license: {
        key: repoData.license?.key || null,
        name: repoData.license?.name || null,
        url: repoData.license?.url || null,
      },
    };
  } catch (error) {
    console.error("Error fetching repository metadata:", error);
    throw new Error("Failed to fetch repository metadata");
  }
}

/**
 * Fetches and processes the README content from a GitHub repository
 * Tries multiple README formats and branches
 * @param githubUrl - Full GitHub repository URL
 * @returns Promise containing the README content, format used, and truncation status
 * @throws Error if README cannot be found or fetched
 */
export async function getGitHubReadme(githubUrl: string): Promise<{
  content: string;
  format: string;
  wasTruncated: boolean;
  metadata: RepoMetadata;
}> {
  try {
    const urlParts = githubUrl.replace("https://github.com/", "").split("/");
    const owner = urlParts[0];
    const repo = urlParts[1];

    // Fetch repository metadata
    const metadata = await getRepoMetadata(owner, repo);

    // Try different branches and README formats
    const branches = ["main", "master"];

    for (const branch of branches) {
      for (const format of README_FORMATS) {
        const response = await fetchGitHubFile(owner, repo, branch, format);
        if (response) {
          const rawContent = await response.text();
          const { content, wasTruncated } = truncateContent(rawContent);
          console.log(
            `Found README at ${format} in ${branch} branch${
              wasTruncated ? " (truncated)" : ""
            }`
          );
          return { content, format, wasTruncated, metadata };
        }
      }
    }

    throw new Error("No README found in any supported format");
  } catch (error) {
    console.error("Error fetching GitHub README:", error);
    throw new Error("Failed to fetch README content");
  }
}

/**
 * Generates a summary and cool facts from a GitHub README using LangChain
 * @param readmeInfo - Object containing README content and metadata
 * @returns Promise containing the summary and cool facts
 * @throws Error if the analysis fails or output format is invalid
 */
export async function generateRepoSummary(readmeInfo: {
  content: string;
  format: string;
  wasTruncated: boolean;
}): Promise<RepoAnalysis> {
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
  }).withStructuredOutput(repoAnalysisSchema, {
    name: "analyze_repository",
    includeRaw: true,
  });

  try {
    const systemPrompt = `You are a helpful assistant that analyzes GitHub repositories.
Given a README file, provide a summary and interesting facts about the repository.
${
  readmeInfo.wasTruncated
    ? "Note: The README content was truncated due to length."
    : ""
}
Format: ${readmeInfo.format}

Instructions:
1. Provide a concise but comprehensive summary
2. Extract 2-4 interesting and non-obvious facts that aren't easily found in the README
3. Focus on technical details and unique aspects
4. Avoid bias and marketing language`;

    const result = await model.invoke([
      { role: "system", content: systemPrompt },
      { role: "user", content: readmeInfo.content },
    ]);

    return result.parsed;
  } catch (error) {
    console.error("Error generating repository summary:", error);
    throw new Error("Failed to generate repository summary");
  }
}
