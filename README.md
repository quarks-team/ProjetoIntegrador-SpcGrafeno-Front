# ProjetoIntegrador-SpcGrafeno-Front
Repository dedicated to codes related to the application's front end.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# CI Pipeline - Documentation

## Overview

This project uses a **GitHub Actions** Continuous Integration (CI) pipeline. The pipeline is triggered automatically on every push, except for the `main` branch, to ensure code quality and consistency by running unit tests and validating dependencies.

## How the Pipeline Works

The pipeline follows these steps:

1. **Repository Checkout**:
   - Uses the `actions/checkout@v3` action to clone the repository into the CI environment.

2. **Node.js Setup**:
   - Configures Node.js (version `20.x`) using `actions/setup-node@v4`.

3. **Dependency Caching**:
   - The pipeline attempts to restore the cache for the `node_modules` directory to speed up the dependency installation process. The cache is based on the hash of the `package-lock.json` file.

4. **Dependency Installation**:
   - Runs `npm ci` to install the dependencies listed in `package.json`, ensuring that the versions locked in `package-lock.json` are used.

5. **Unit Test Execution**:
   - Executes the unit tests using the script `npm run test:unit`, which uses `vue-cli-service` to run the tests with Jest.

### Example of Pipeline Configuration (GitHub Actions)

```yaml
name: CI Pipeline

on:
  push:
    branches-ignore:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      # Step 1: Checkout the repository
      - name: Checkout repository
        uses: actions/checkout@v3

      # Step 2: Set up Node.js
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'

      # Step 3: Cache node modules
      - name: Cache node modules
        uses: actions/cache@v3
        with:
          path: spc_front/spc_login/node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('spc_front/spc_login/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-

      # Step 4: Install dependencies
      - name: Install dependencies
        run: npm ci
        working-directory: spc_front/spc_login  # Correct path

      # Step 5: Run unit tests
      - name: Run tests
        run: npm run test:unit
        working-directory: spc_front/spc_login  # Correct path
```

## Accessing and Analyzing Logs

After each pipeline run, logs can be accessed directly from the **GitHub Actions** interface. To view the logs:

1. Navigate to the **Actions** tab in the GitHub repository.
2. Select the most recent pipeline run.
3. Click on any pipeline step to expand the details and view the execution logs.

If an error occurs, the logs will contain details on the cause, helping with the analysis.

### Example of error logs:
```
npm error Missing script: "test"
npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2024-10-10T23_49_32_007Z-debug-0.log
Error: Process completed with exit code 1.
```

## Troubleshooting

### 1. Dependency Errors

If the pipeline fails during the dependency installation step, it might be due to outdated package versions or cache issues.

**Steps to fix:**
1. Ensure that both the `package.json` and `package-lock.json` files are correct and versioned.
2. Try clearing the CI cache by changing the cache key like this:

```yaml
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: spc_front/spc_login/node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('spc_front/spc_login/package-lock.json') }}-v2  # Update cache version
    restore-keys: |
      ${{ runner.os }}-node-
```

3. Verify the dependencies locally by running `npm install` or `npm ci` and try to reproduce the error.

### 2. Test Failures

If the pipeline fails during the test execution, follow these steps:

**Steps to fix:**
1. Run the tests locally to reproduce the error using:
   ```bash
   npm run test:unit
   ```
2. Check the error logs on GitHub Actions or locally.
3. Adjust the tests, ensuring that all test dependencies are correctly configured in `package.json`.

## Updates and Maintenance

- **Adding New Scripts**: Whenever new scripts are added to the `package.json`, ensure that the pipeline is updated to reflect the changes.
- **Dependency Updates**: When updating or adding dependencies, make sure that the CI cache is properly updated.
- **Log Monitoring**: After each push or merge, review the CI execution to ensure that the code continues to work as expected.
