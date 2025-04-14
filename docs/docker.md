# Local Environment Setup

This guide will walk you through setting up your local environment for the project.

## Prerequisites

- Docker Desktop installed on your machine
- Access to the project repository

## Setup Steps

### 1. Download Configuration Files

1. Download the following files:
   - `.env.dev`
   - `grafana.ini`

### 2. File Organization

1. In your local project directory, create a folder structure as follows:
   ```
   containerisation/
   ├── env/
   └── grafana/
   ```
2. Move the downloaded files:
   - Place `.env.dev` in the `containerisation/env/` folder
   - Place `grafana.ini` in the `containerisation/grafana/` folder

### 3. Run Docker Containers

1. Open a terminal in your local repository root.
2. Execute the following command:
   ```bash
   sh cli/up_compose.sh
   ```
3. This script will build and start the necessary Docker containers for the project.

### 4. Verify Setup

1. Open Docker Desktop
2. Navigate to the "Containers" section
3. You should see the project containers running

## Troubleshooting

If you encounter any issues during setup, please check the following:
- Ensure all prerequisites are met
- Verify that the configuration files are in the correct locations
- Check Docker logs for any error messages

For further assistance, please contact the project maintainer.