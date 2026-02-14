from fastapi import APIRouter, File, UploadFile
from pydantic import BaseModel
from app.services.research_nodes import ResearchState, subtopics_node, researcher_node, cross_analysis_node, gap_detector_node, final_report_node
from app.services.research_graph import build_research_graph

router = APIRouter(prefix="/api/research")

class Topic(BaseModel):
    topic: str

@router.post("/topic")
def run_research(req: Topic):
    initial_state = ResearchState(topic=req.topic)
    research_graph = build_research_graph()
    result = research_graph.invoke(initial_state)
    return [{"message": "Report generated sucessfully", "result": result}]