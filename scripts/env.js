// This script runs at container startup to handle environment variables
const fs = require("fs");
const path = require("path");

// List of environment variables we want to substitute
const ENV_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "OPENAI_API_KEY",
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "NEXT_PUBLIC_DEMO_API_KEY",
];

// Function to validate required environment variables
function validateEnvVars() {
  const missingVars = ENV_VARS.filter((varName) => !process.env[varName]);
  if (missingVars.length > 0) {
    console.error("Error: Missing required environment variables:");
    missingVars.forEach((varName) => {
      console.error(`- ${varName}`);
    });
    process.exit(1);
  }
}

// Validate environment variables
validateEnvVars();

// Log successful initialization
console.log("Environment variables validated successfully");
