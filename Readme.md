# Project Title

This project is a containerized web application that lets a user search for up to 4 places matching a query and displays the results as markers on an interactive map.

## Documentation

- Purpose: let users quickly find up to 4 place matches for a search term and visualize them on a map.
- Features:
    - Text search (user query) returning up to 4 relevant places.
    - Interactive map with markers for each result and a detail popup on click.
    - Basic result list alongside the map with quick-centering controls.
- Architecture: single-page frontend (map + UI) communicating with a backend or direct API calls to the Gemini (or other) places API to fetch results. Map component displays location coordinates returned by the API.
- Dependencies: Docker, Docker Compose, a valid GEMINI_API_KEY (see Installation), map library (e.g., Leaflet or Mapbox), Node.js toolchain if running frontend locally.
- Configuration: environment variables and example:
    - GEMINI_API_KEY=<your_key> (required; see Installation)

## Installation

Prerequisites:
- Docker and Docker Compose installed.
- A valid GEMINI_API_KEY (obtain from the Gemini API provider).

Before running:
Add a .env file at the project root with your valid GEMINI_API_KEY. Example:
```env
GEMINI_API_KEY=your_valid_gemini_api_key_here
```

Install and run:
```bash
# clone the repository
git clone <REPO_URL>
cd <REPO_NAME>

# build and start containers
docker-compose up --build
```

## Usage

After the containers start, open a browser and go to:
http://localhost:5173

