from fastapi import FastAPI, Query, HTTPException
import requests
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import httpx
import re, os
from dotenv import load_dotenv

app = FastAPI(
    title="Trending Open Source Projects",
    version="1.0.0",
    description="Fetch trending GitHub projects based on license and other parameters. This API allows users to search for repositories that are licensed under specific types and have a certain number of stars.",
    license_info={
         "name": "GNU General Public License (GPL)",  # License changed to GPL
        "url": "https://www.gnu.org/licenses/gpl-3.0.html",  # URL for GPL license
    }

)

# Load environment variables from .env file
load_dotenv()

TOKEN = os.getenv("GITHUB_TOKEN")
if not TOKEN:
    raise HTTPException(status_code=500, detail="GitHub token is missing")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# FastAPI route to fetch projects by license type
@app.get("/trending")
async def fetch_projects_by_license(license_type: str, per_page: int = 10):
    """
    Fetches GitHub repositories based on a specified license type and filters
    by repositories with more than 1000 stars. Returns specific fields:
    name, star count, repository link, description, and likes.

    Parameters:
    - license_type (str): The license type (e.g., "mit", "apache-2.0").
    - per_page (int): Number of projects to fetch per page (default: 10).
    """
    url = "https://api.github.com/search/repositories"
    headers = {
        "Authorization": f"token {TOKEN}",  # Use "token" instead of "Bearer"
        "Accept": "application/vnd.github.v3+json"
    }
    params = {
        "q": f"license:{license_type} stars:>500",  # License and stars filter
        "sort": "stars",
        "order": "desc",
        "per_page": per_page
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()

            # Filter data to return only specific fields
            projects = [
                {
                    "image": repo["owner"]["avatar_url"],
                    "name": repo["name"],
                    "stars": repo["stargazers_count"],
                    "link": repo["html_url"],
                    "description": repo["description"],
                    "forks": repo["forks_count"],
                    "likes": repo["stargazers_count"],
                    "open_issues": repo["open_issues_count"],
                    "watchers": repo["watchers_count"],
                    "language": repo["language"],
                    "created_at": repo["created_at"]
                }
                for repo in data["items"]
            ]
            return projects
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="Failed to fetch data from GitHub")




@app.get("/projects")
async def fetch_projects(license_type: str = "All"):
    """
    Fetches GitHub repositories with more than 500 stars, and filters by license type.
    """
    url = "https://api.github.com/search/repositories"
    headers = {
        "Authorization": f"Bearer {TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }

    # If license is 'All', do not filter by license, else filter by selected license
    license_query = f"license:{license_type}" if license_type != "All" else ""

    params = {
        "q": f"stars:>500 {license_query}".strip(),
        "sort": "stars",
        "order": "desc",
        "per_page": 100  # Limit results to 100 per page
    }

    projects = []
    page = 1
    while len(projects) < 1000:
        params["page"] = page  # Update the page number for each request
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, headers=headers, params=params)
                response.raise_for_status()
                data = response.json()

                # Check if 'items' key exists to avoid errors
                if "items" not in data:
                    raise HTTPException(status_code=500, detail="No items found in response")

                # Add the fetched projects to the list
                projects.extend([
                    {
                        "image": repo["owner"]["avatar_url"],
                        "name": repo["name"],
                        "stars": repo["stargazers_count"],
                        "link": repo["html_url"],
                        "description": re.sub(r'[^a-zA-Z0-9\s]', '', repo["description"] or ""),
                        "likes": repo["stargazers_count"],  # Interpreting stars as likes
                        "open_issues": repo["open_issues_count"],
                        "language": repo["language"],
                        "forks": repo["forks_count"],
                        "license": repo["license"]["name"] if repo["license"] else "No license"
                    }
                    for repo in data["items"]
                ])

                # Break if less than 100 results were returned (indicating we've reached the end)
                if len(data["items"]) < 100:
                    break

                # Increment the page number for the next request
                page += 1

        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail="Failed to fetch data from GitHub")

    # Return only the first 1000 projects (in case we collected more than needed)
    return projects[:1000]
