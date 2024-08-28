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
      "v1",
    );

    const templateExampleCoreDir = path.join(
      __dirname,
      "../",
      "template",
      "example",
      "core",
    );

    const srcDir = path.join(projectPath, "src");
    const appDir = path.join(srcDir, "app");

    fs.cpSync(templateExampleDir, appDir, { recursive: true });
    fs.cpSync(templateExampleCoreDir, srcDir, { recursive: true });
  }

  console.log("Project structure created!");
}

// Function to edit package.json
function editPackageJson(
  projectPath: string,
  customScripts: Record<string, string>,
) {
  const packageJsonPath = path.join(projectPath, "package.json");

  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    // Merge custom scripts with existing scripts
    packageJson.scripts = { ...packageJson.scripts, ...customScripts };

    // Write the updated package.json back to disk
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log("Custom scripts added to package.json!");
  } else {
    console.error("Error: package.json not found.");
  }
}

// Function to create files and directories for new CRUD
function createCrudFiles(targetDir: string, entityName: string) {
  const templateDir = path.join(__dirname, "../", "template", "example");
  if (!fs.existsSync(templateDir)) {
    console.error(`Template directory not found at ${templateDir}`);
    return;
  }

  // Copy and rename files
  function copyAndRenameFiles(srcDir: string, destDir: string) {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.readdirSync(srcDir).forEach((file) => {
      const srcPath = path.join(srcDir, file);
      let destPath = path.join(destDir, file.replace(/sample/g, entityName));

      if (fs.statSync(srcPath).isDirectory()) {
        copyAndRenameFiles(srcPath, destPath);
      } else {
        let content = fs.readFileSync(srcPath, "utf-8");
        content = content.replace(/sample/g, entityName);
        content = content.replace(
          /Sample/g,
          entityName.charAt(0).toUpperCase() + entityName.slice(1),
        );
        fs.writeFileSync(destPath, content);
        console.log(`Created: ${destPath}`);
      }
    });
  }

  const handlersDir = path.join(templateDir, "core", "handlers");
  const handlersDistDir = path.join(targetDir, "src", "core", "handlers");

  const modelsDir = path.join(templateDir, "core", "models");
  const modelsDistDisr = path.join(targetDir, "src", "core", "models");

  const pageDir = path.join(templateDir, "v1", "sample");
  const pageDistDir = path.join(targetDir, "src", "app", "v1", entityName);

  copyAndRenameFiles(handlersDir, handlersDistDir);
  copyAndRenameFiles(modelsDir, modelsDistDisr);
  copyAndRenameFiles(pageDir, pageDistDir);
}

// Function to copy the Layout.tsx file
function addPagesLayout(targetDir: string, entityName: string) {
  const templateDir = path.join(__dirname, "../", "template", "example");

  const layoutSrcFile = path.join(templateDir, "v1", "layout.tsx");
  const layoutDistFile = path.join(targetDir, "src", "app", "v1", "layout.tsx");

  // Ensure the destination directory exists
  const layoutDistDir = path.dirname(layoutDistFile);
  if (!fs.existsSync(layoutDistDir)) {
    fs.mkdirSync(layoutDistDir, { recursive: true });
  }

  // Check if the file exists and copy it if it doesn't
  if (!fs.existsSync(layoutDistFile)) {
    fs.copyFileSync(layoutSrcFile, layoutDistFile);
    console.log(`File copied from ${layoutSrcFile} to ${layoutDistFile}`);
  } else {
    console.log(`File already exists at ${layoutDistFile}, skipping copy.`);
  }

  console.log(`CRUD structure for ${entityName} created successfully!`);
}

// Function to add a new array to the server.json
function addFakeDataToMockServer(entityName: string, targetDir: string) {
  const mockServerPath = path.join(targetDir, "mock", "server.json");

  // Check if the server.json file exists
  if (!fs.existsSync(mockServerPath)) {
    console.error("Error: server.json not found.");
    return;
  }

  // Read the existing server.json file
  const serverData = JSON.parse(fs.readFileSync(mockServerPath, "utf-8"));

  // Define the fake data array to add
  const fakeDataArray = [
    {
      id: "45f6402e-f4be-43e4-973c-b13bc5e9e949",
      firstName: "Alexander",
      lastName: "Wilson",
      age: 33,
      email: "alex.wilson@example.com",
      password: "alexW@33!",
    },
    {
      id: "2de875cc-c42e-4f25-b72a-9126cfe94ed2",
      firstName: "Olivia",
      lastName: "Anderson",
      age: 22,
      email: "olivia.anderson@example.com",
      password: "OliviaA22#",
    },
    {
      id: "81f39980-d3a7-43c4-a82c-78115d61e542",
      firstName: "David",
      lastName: "Thomas",
      age: 34,
      email: "david.thomas@example.com",
      password: "dThomas#34",
    },
  ];

  // Add the new array to the server data with the specified entity name
  serverData[entityName] = fakeDataArray;

  // Write the updated JSON back to the server.json file
  fs.writeFileSync(mockServerPath, JSON.stringify(serverData, null, 2));
  console.log(`Added fake data for ${entityName} to server.json!`);
}

// Function to check if a page already exists
function checkIfPageExists(targetDir: string, entityName: string): boolean {
  const pagePath = path.join(targetDir, "src", "app", "v1", entityName);
  return fs.existsSync(pagePath);
}

// Function to add a new route to routes.tsx
function addRouteToRoutesFile(entityName: string, targetDir: string) {
  const routesFilePath = path.join(targetDir, "src", "routes.tsx");

  if (!fs.existsSync(routesFilePath)) {
    console.error("Error: routes.tsx file not found.");
    return;
  }

  // Read the existing routes.tsx file
  let routesFileContent = fs.readFileSync(routesFilePath, "utf-8");

  // Find the insertion point for new route
  const routesArrayEndIndex = routesFileContent.lastIndexOf("];");

  if (routesArrayEndIndex === -1) {
    console.error("Error: routes array not found in routes.tsx.");
    return;
  }

  // Create the new route object to be added
  const newRoute = `  {
    icon: <TbTemplate size={24} />,
    label: "CRUD ${entityName.charAt(0).toUpperCase() + entityName.slice(1)}",
    url: "/v1/${entityName}",
  },\n`;

  // Insert the new route object before the closing of the routes array
  routesFileContent =
    routesFileContent.slice(0, routesArrayEndIndex) +
    newRoute +
    routesFileContent.slice(routesArrayEndIndex);

  // Write the updated content back to routes.tsx
  fs.writeFileSync(routesFilePath, routesFileContent);
  console.log(`Route for ${entityName} added to routes.tsx!`);
}

// Main function
async function main() {
  const [command, ...args] = process.argv.slice(2);

  if (command === "new-project") {
    const projectName = args[0];
    if (!projectName) {
      console.error("Error: Project name is required.");
      process.exit(1);
    }

    const response = await prompts([
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

    const projectPath = path.join(process.cwd(), projectName);

    // Step 1: Create Next.js Project
    await createNextApp(projectName);

    // Step 2: Install Custom Dependencies
    installDependencies(projectPath);

    // Step 3: Edit package.json to add custom scripts
    const customScripts = {
      server: "json-server --watch ./mock/server.json --port 3333",
    };
    editPackageJson(projectPath, customScripts);

    // Step 4: Create Project Structure
    createStructure(projectPath, response.template === "blank");
  } else if (command == "new-crud") {
    const entityName = args[0];
    if (!entityName) {
      console.error("Error: Entity name is required.");
      process.exit(1);
    }

    const targetDir = process.cwd(); // Assume running from project root

    // Check if the page already exists
    if (checkIfPageExists(targetDir, entityName)) {
      console.error(
        `Error: A page named "${entityName}" already exists in src/app/v1/. Cannot create duplicate CRUD.`,
      );
      return; // Exit if the page already exists
    }

    createCrudFiles(targetDir, entityName);
    addPagesLayout(targetDir, entityName);
    addFakeDataToMockServer(`${entityName}s`, targetDir);
    addRouteToRoutesFile(entityName, targetDir);
  } else {
    console.error(`Unknown command: ${command}`);
    process.exit(1);
  }
}

// Run the CLI
main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
