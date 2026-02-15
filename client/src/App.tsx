import { useState, useEffect, useRef } from "react"
import axios from "axios"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import remarkGfm from "remark-gfm"
import mermaid from "mermaid"

// Typing animation component
function TypingMarkdown({ text, speed = 15 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("")
  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index))
      index++
      if (index > text.length) clearInterval(interval)
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])
  return (
    <div className="prose prose-invert max-w-none overflow-x-auto">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayedText}</ReactMarkdown>
    </div>
  )
}


function MermaidChart({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || !chart) return

    // ✅ Clean AI output
    const cleanChart = chart
      .replace(/```mermaid/g, "")
      .replace(/```/g, "")
      .trim()

    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      flowchart: {
        useMaxWidth: false,
      },
    })

    const renderChart = async () => {
      try {
        const { svg } = await mermaid.render(
          `mermaid-${Date.now()}`,
          cleanChart
        )

        ref.current!.innerHTML = svg

        const svgElement = ref.current!.querySelector("svg")
        if (svgElement) {
          svgElement.style.width = "100%"
          svgElement.style.height = "auto"
        }

      } catch (err) {
        console.error("Mermaid render error:", err)
      }
    }

    renderChart()
  }, [chart])

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        overflowX: "auto",
      }}
    />
  )
}


// Main App
export default function App() {
  const [topic, setTopic] = useState("")
  const [report, setReport] = useState("")
  const [mindMap, setMindMap] = useState(`
graph LR
    Cybersecurity --> Artificial Intelligence
    Cybersecurity --> Blockchain Security
    Cybersecurity --> Cloud Security
    Cybersecurity --> Cryptography
    Cybersecurity --> Cybersecurity Awareness
    Cybersecurity --> Data Breach Response
    Cybersecurity --> Endpoint Security
    Cybersecurity --> Incident Response Planning
    Cybersecurity --> Internet of Things (IoT) Security
    Cybersecurity --> Machine Learning
    Cybersecurity --> Network Security
    Cybersecurity --> Penetration Testing
    Cybersecurity --> Phishing Detection
    Cybersecurity --> Ransomware Protection
    Cybersecurity --> Secure Communication Protocols
    Cybersecurity --> Security Information and Event Management (SIEM)
    Cybersecurity --> Social Engineering
    Cybersecurity --> Threat Intelligence
    Cybersecurity --> Vulnerability Assessment
    Cybersecurity --> Web Application Security
    Cybersecurity --> Wireless Network Security

    Cybersecurity --> Advanced Persistent Threats (APTs)
    Cybersecurity --> Cybersecurity Governance
    Cybersecurity --> Cybersecurity Regulations
    Cybersecurity --> Data Loss Prevention
    Cybersecurity --> Identity and Access Management
    Cybersecurity --> Insider Threat Detection
    Cybersecurity --> Malware Analysis
    Cybersecurity --> Secure Software Development
    Cybersecurity --> Zero-Trust Architecture

    Research Gaps --> Limited Focus on Education
    Research Gaps --> Insufficient Emphasis on Emerging Tech
    Research Gaps --> Lack of Research on Specific Industries

    Research Gaps --> Cybersecurity in AI
    Research Gaps --> Cybersecurity in IoT Devices
    Research Gaps --> Cybersecurity and Human Factors

    Future Research --> Investigating Emerging Tech
    Future Research --> Developing Cybersecurity Education
    Future Research --> Cybersecurity in Specific Industries
`   )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) return

    setLoading(true)
    setError("")
    setReport("")
    setMindMap("")

    try {
      const response = await axios.post(
        "http://localhost:8000/api/research/topic",
        { topic }
      )

      const result = response.data[0].result
      setReport(result.final_report)
      setMindMap(result.mind_map) 
    } catch (err) {
      setError("Something went wrong. Please try again.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 w-full flex justify-center">
      <div className="w-full max-w-6xl space-y-6 ">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">AI Research Assistant</h1>
          <p className="text-zinc-400">Generate structured research reports instantly</p>
        </div>

        {/* Input Card */}
        <Card className="bg-zinc-800 text-white border-zinc-700 ">
          <CardHeader>
            <CardTitle>Enter Research Topic</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                placeholder="e.g. Impact of AI in Healthcare"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-zinc-700 text-zinc-400 border-stone-700"
              />
              <Button disabled={loading}>
                {loading ? "Researching..." : "Generate"}
              </Button>
            </form>
            {error && <p className="text-red-500 mt-3">{error}</p>}
          </CardContent>
        </Card>

        {/* Report Card */}
        {report || mindMap && (
          <Card className="bg-zinc-900 text-zinc-400 border-zinc-700 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Final Report</CardTitle>
            </CardHeader>
            <Separator className="bg-zinc-700" />
            <CardContent className="space-y-6">

              {/* Mind Map at the top */}
              {mindMap && (
                <div className="bg-zinc-800 p-4 rounded-md w-full">
                  <h3 className="text-white mb-2">Mind Map</h3>
                  <MermaidChart chart={mindMap} />
                </div>
              )}

              {/* Report */}
              <TypingMarkdown text={report} speed={15} />

            </CardContent>
          </Card>
        )}

      </div>
    </div>
  )
}