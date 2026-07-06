# Analysis: Next.js Setup for Sara D'Angelo Landing Page

## Problem Definition
The objective is to scaffold a Next.js (App Router) project with Tailwind CSS into `c:/Users/mario/Progetti Antigravity/sara-dangelo` without overwriting or losing the existing files (`PROJECT.md`, `ORIGINAL_REQUEST.md`, media files, etc.).
Additionally, the user requested the strict use of `framer-motion` for premium animations.

## Observations
1. **Existing Files**: The target directory is not empty. It contains markdown documentation, `.jpeg` files, and a directory containing more media (`WeTrasfer matrimoni nuovi`).
2. **`create-next-app` Behavior**: Running `npx create-next-app@latest .` directly in a non-empty directory will throw a conflict error. The Next.js CLI currently considers any existing file as a potential conflict, preventing direct initialization in the root directory.
3. **Framework Requirements**: Next.js App Router, Tailwind CSS, TypeScript (inferred from TS snippets in specs), ESLint, and `framer-motion` as a hard dependency.
4. **Vercel Deployability**: Vercel works best with zero-configuration deployments when the standard Next.js directory structure (`package.json`, `app/`, etc.) is located at the root of the Git repository.

## Logic Chain
- Because `create-next-app` cannot run directly in `.` when files are present, we must run it in a temporary subdirectory to safely generate all boilerplate files (like `package.json`, `tsconfig.json`, `app/` folder, etc.).
- Once the subdirectory is fully populated, the files can be safely moved to the parent root directory.
- Hidden files (such as `.gitignore`, `.eslintrc.json`, and `.git`) must also be moved to the root to ensure tooling and version control work perfectly.
- To meet the strict animation requirement provided by the user, `framer-motion` must be installed immediately after the files are moved.
- Finally, the requested folder structure for Milestone 1.3 (`components/`, `lib/`, `public/media/`) should be created.

## Recommended Commands
Based on the analysis, the implementer should execute the following sequence of commands in the `c:/Users/mario/Progetti Antigravity/sara-dangelo` directory using PowerShell:

1. Create the Next.js app in a subfolder:
```powershell
npx create-next-app@latest next_app --ts --tailwind --eslint --app --src-dir false --import-alias "@/*" --use-npm --yes
```

2. Move all standard and hidden files to the root:
```powershell
Move-Item -Path .\next_app\* -Destination . -Force
Move-Item -Path .\next_app\.* -Destination . -Force -ErrorAction SilentlyContinue
```

3. Remove the now-empty subfolder:
```powershell
Remove-Item -Path .\next_app -Recurse -Force
```

4. Install the required animation library:
```powershell
npm install framer-motion
```

5. Create the required directories for the architecture:
```powershell
New-Item -ItemType Directory -Force -Path "components", "lib", "public\media"
```

## Caveats
- Moving `.*` might result in an error related to moving `.` and `..`, which is why `-ErrorAction SilentlyContinue` is appended. This is normal and expected.
- If there is an existing `.git` directory in the root, moving the `.git` folder from `next_app` will overwrite it. However, since there is no existing `.git` at the root yet, this will simply initialize the repository correctly.
