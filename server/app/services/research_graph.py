from langgraph.graph import StateGraph, END
from app.services.research_nodes import (
    ResearchState,
    subtopics_node,
    researcher_node,
    cross_analysis_node,
    gap_detector_node,
    final_report_node,
    mind_map_node,
)

def build_research_graph():
    graph = StateGraph(ResearchState)
   
    graph.add_node("subtopics", subtopics_node)
    graph.add_node("researcher", researcher_node)
    graph.add_node("cross_analysis", cross_analysis_node)
    graph.add_node("gap_detector", gap_detector_node)
    graph.add_node("final_report", final_report_node)
    graph.add_node("mind_map", mind_map_node)

    graph.set_entry_point("subtopics")

    graph.add_edge("subtopics", "researcher")
    graph.add_edge("researcher", "cross_analysis")
    graph.add_edge("cross_analysis", "gap_detector")
    graph.add_edge("gap_detector", "final_report")
    graph.add_edge("final_report", "mind_map")
    graph.add_edge("mind_map", END)
    
    graph = graph.compile()
    return graph