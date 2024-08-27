import { execSync } from "child_process";
import prompts from "prompts";
import fs from "fs";
import path from "path";

// Function to create a Next.js project
async function createNextApp(projectName: string) {
  console.log(`Creating Next.JS project: ${projectName}`);
  execSync(
    `bunx create-next-app@latest ${projectName} --typescript --turbo --eslint --tailwind --src-dir --app --skip-install --use-bun --empty --no-import-alias`,
    { stdio: "inherit" },
  );
}

// Function to install custom dependencies
function installDependencies(projectPath: string) {
  console.log(`Installing custom dependencies...`);
  const dependencies = [
    "@hookform/resolvers@^3.9.0",
    "@radix-ui/react-avatar@^1.1.0",
    "@radix-ui/react-checkbox@^1.1.1",
    "@radix-ui/react-dialog@^1.1.1",
    "@radix-ui/react-dropdown-menu@^2.1.1",
    "@radix-ui/react-label@^2.1.0",
    "@radix-ui/react-menubar@^1.1.1",
    "@radix-ui/react-popover@^1.1.1",
    "@radix-ui/react-select@^2.1.1",
    "@radix-ui/react-separator@^1.1.0",
    "@radix-ui/react-slot@^1.1.0",
    "@radix-ui/react-toast@^1.2.1",
    "@radix-ui/react-tooltip@^1.1.2",
    "@tanstack/react-query@^5.51.23",
    "@tanstack/react-table@^8.20.1",
    "axios@^1.7.3",
    "class-variance-authority@^0.7.0",
    "clsx@^2.1.1",
    "dayjs@^1.11.12",
    "jotai@^2.9.2",
    "js-cookie@^3.0.5",
    "lucide-react@^0.426.0",
    "next@14.2.5",
    "react@^18.3.1",
    "react-dom@^18.3.1",
    "react-hook-form@^7.52.2",
    "react-icons@^5.2.1",
    "tailwind-merge@^2.4.0",
    "tailwindcss-animate@^1.0.7",
    "uuid@^10.0.0",
    "zod@^3.23.8",
  ];

  execSync(`bun add ${dependencies.join(" ")}`, {
    cwd: projectPath,
    stdio: "inherit",
  });

  console.log("Dependencies installed successfully!");

  console.log("\n\nInstalling Development Dependencies...");
  const devDependencies = [
    "@types/js-cookie@^3.0.6",
    "@types/node@^20.14.14",
    "@types/react@^18.3.3",
    "@types/react-dom@^18.3.0",
    "@types/uuid@^10.0.0",
    "eslint@^8",
    "eslint-config-next@14.2.5",
    "eslint-plugin-prettier@^5.2.1",
    "globals@^15.9.0",
    "json-server@^1.0.0-beta.1",
    "postcss@^8.4.41",
    "prettier@^3.3.3",
    "tailwindcss@^3.4.9",
    "typescript@^5.5.4",
    "typescript-eslint@^8.0.1",
  ];

  execSync(`bun add --dev ${devDependencies.join(" ")}`, {
    cwd: projectPath,
    stdio: "inherit",
  });

  console.log("development dependencies installed successfully!");
}

// Function to create files and directories
function createStructure(projectPath: string, isBlank: boolean) {
  // Pre defined files and folders
  const templateWebsiteDir = path.join(__dirname, "../", "template", "website");
  fs.cpSync(templateWebsiteDir, projectPath, { recursive: true });

  if (!isBlank) {
    const templateExampleDir = path.join(
      __dirname,
      "../",
      "template",
      "example",
    );

    const appDir = path.join(projectPath, "src/app");

    fs.cpSync(templateExampleDir, appDir, { recursive: true });
  }

  console.log("Project structure created!");
}

// Main function
async function main() {
  const response = await prompts([
    {
      type: "text",
      name: "projectName",
      message: "Project name:",
      validate: (name) => (name ? true : "Project name cannot be empty"),
    },
    {
      type: "select",
      name: "template",
      message: "Choose a template:",
      choices: [
        { title: "Blank Project", value: "blank" },
        { title: "Example Project", value: "example" },
      ],
    },
  ]);

  const projectPath = path.join(process.cwd(), response.projectName);

  // Step 1: Create Next.js Project
  await createNextApp(response.projectName);

  // Step 2: Install Custom Dependencies
  installDependencies(projectPath);

  // Step 3: Create Project Structure
  createStructure(projectPath, response.template === "blank");
}

// Run the CLI
main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
