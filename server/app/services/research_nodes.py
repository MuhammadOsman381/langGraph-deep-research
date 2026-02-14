import os
from langchain_groq import ChatGroq
from pydantic import BaseModel
from typing import List, Dict
from tavily import TavilyClient

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
    mind_map = ["graph TD"]
    mind_map.append(f"A[Topic: {state.topic}]")
    for i, subtopic in enumerate(state.subtopics):
        mind_map.append(f"A --> B{i}[{subtopic}]")
        finding_text = state.findings.get(subtopic, "No findings")
        mind_map.append(f"B{i} --> C{i}[{finding_text[:50]}...]")  # truncated for readability
    for j, gap in enumerate(state.gaps):
        mind_map.append(f"A -.-> D{j}[Gap: {gap}]")
    state.mind_map = "\n".join(mind_map)
    return state