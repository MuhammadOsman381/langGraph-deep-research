import os
from langchain_groq import ChatGroq
from pydantic import BaseModel
from typing import List, Dict
from tavily import TavilyClient
from app.services.scraper import create_driver, crawl
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import json
import requests
import time
import random
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
from app.services.json_files import create_json_file

class ResearchState(BaseModel):
    topic: str
    subtopics: List[str] = []
    findings: Dict[str, str] = {}
    cross_analysis: str = ""
    gaps: List[str] = []
    final_report: str = ""
    mind_map: str = ""


llm = ChatGroq(
    model="meta-llama/llama-4-scout-17b-16e-instruct",
    temperature=0,
    api_key=os.environ.get("GROQ_API_KEY"),
)

tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))


def search_wikipedia(query, limit=5):
    url = "https://en.wikipedia.org/w/api.php"

    headers = {
        "User-Agent": "MyResearchBot/1.0 (mosman257@gmail.com)"
    }
    params = {
        "action": "query",
        "list": "search",
        "srsearch": query,
        "format": "json",
        "srlimit": limit
    }
    response = requests.get(url, params=params, headers=headers)
    if response.status_code != 200:
        print("Error:", response.status_code)
        return []
    return response.json()

def extract_wiki_links(api_response):
    links = []
    for item in api_response.get("query", {}).get("search", []):
        title = item["title"].replace(" ", "_")
        url = f"https://en.wikipedia.org/wiki/{title}"
        links.append(url)
    return links


def recursive_web_crawler():
    topic = "Impact of AI on the job market"
    driver = create_driver()
    seed_urls = extract_wiki_links(search_wikipedia(topic))
    driver = create_driver()
    all_data = []
    for seed in seed_urls:
        seed_url = seed
        data = crawl(seed_url, seed, driver)
        all_data.extend(data)
    driver.quit()
    create_json_file(all_data)
    # json_data = json.dumps(all_data, indent=4)
    # print(json_data)



def subtopics_node(state: ResearchState):
    messages = [
        ("system", "Break the topic into 30 research subtopics."),
        ("human", state.topic),
    ]
    response = llm.invoke(messages)
    state.subtopics = [s.strip() for s in response.content.split("\n") if s.strip()]
    return state


def researcher_node(state: ResearchState):
    findings = {}
    for subtopic in state.subtopics:
        response = tavily.search(query=subtopic, search_depth="advanced", max_results=1)
        results = response.get("results", [])
        formatted_results = "\n\n".join(
            [
                f"Title: {r.get('title')}\n"
                f"Content: {r.get('content')}\n"
                f"URL: {r.get('url')}"
                for r in results
            ]
        )
        print("tavily_results", formatted_results)

        messages = [
            (
                "system",
                "You are a professional research analyst. Summarize the key findings clearly and concisely.",
            ),
            (
                "human",
                f"Research Topic: {subtopic}\n\nWeb Results:\n{formatted_results}",
            ),
        ]
        llm_response = llm.invoke(messages)
        print("tavily_formatted_results", llm_response.content.strip())
        findings[subtopic] = llm_response.content.strip()
    state.findings = findings
    return state


def gap_detector_node(state: ResearchState):
    messages = [
        ("system", "Analyze these findings and identify missing areas or gaps."),
        ("human", "\n".join(f"{k}: {v}" for k, v in state.findings.items())),
    ]
    response = llm.invoke(messages)
    state.gaps = [gap.strip() for gap in response.content.split("\n") if gap.strip()]
    print("gap_detector_node", state.gaps)
    return state


def cross_analysis_node(state: ResearchState):
    messages = [
        (
            "system",
            "Analyze these findings across subtopics and summarize overall insights.",
        ),
        ("human", "\n".join(f"{k}: {v}" for k, v in state.findings.items())),
    ]
    response = llm.invoke(messages)
    state.cross_analysis = response.content.strip()
    print("cross_analysis_node", state.cross_analysis)
    return state


def final_report_node(state: ResearchState):
    messages = [
        (
            "system",
            "You are an expert research analyst. Generate a **structured final report in Markdown** format. "
            "Use headings, subheadings, bullet points, and tables where appropriate. Include sections: "
            "Findings, Gaps, Cross Analysis.",
        ),
        (
            "human",
            f"""
            Topic: {state.topic}

            Subtopics:
            {', '.join(state.subtopics)}

            Findings:
            {state.findings}

            Gaps:
            {state.gaps}

            Cross Analysis:
            {state.cross_analysis}
            """,
        ),
    ]
    response = llm.invoke(messages)
    state.final_report = response.content.strip()
    return state


def mind_map_node(state: ResearchState):
    prompt = f"""
    Generate a clean and readable Mermaid mind map.

    Rules:
    - Use graph LR
    - Keep it compact
    - Group subtopics under categories
    - Avoid very long text (max 6 words per node)
    - No markdown formatting (**)
    - Valid Mermaid syntax only

    Topic: {state.topic}

    Subtopics:
    {state.subtopics}

    Research Gaps:
    {state.gaps}

    Output only Mermaid code.
    """

    response = llm.invoke(
        [
            ("system", "You are an expert at generating valid Mermaid diagrams."),
            ("human", prompt),
        ]
    )

    state.mind_map = response.content.strip()
    return state
