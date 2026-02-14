import { useState, useEffect, useRef } from "react"
import axios from "axios"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import remarkGfm from "remark-gfm"
import mermaid from "mermaid"
import { MermaidGraph } from "mermaid-graph";

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

// Mermaid chart wrapper component
function MermaidChart({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = chart
      mermaid.init(undefined, ref.current)
    }
  }, [chart])

  return <div ref={ref}></div>
}

// Main App
export default function App() {
  const [topic, setTopic] = useState("")
  const [report, setReport] = useState("")
  const [mindMap, setMindMap] = useState("graph TD A[Topic: Blockchain & Cryptocurrency.] A --> B0[Here are 30 research subtopics related to Blockchain & Cryptocurrency:] B0 --> C0[Based on the provided web results, here are the ke...] A --> B1[**Blockchain Research Subtopics (15)**] B1 --> C1[**Key Findings: Blockchain Research Subtopics** A...] A --> B2[1. **Blockchain Scalability**: Exploring solutions to improve the scalability of blockchain networks.] B2 --> C2[**Key Findings: Blockchain Scalability Solutions**...] A --> B3[2. **Blockchain Security**: Analyzing the security threats and vulnerabilities of blockchain networks.] B3 --> C3[**Key Findings: Blockchain Security Threats and Vu...] A --> B4[3. **Consensus Algorithms**: Comparing and evaluating different consensus algorithms (e.g., PoW, PoS, DPoS).] B4 --> C4[**Consensus Algorithms Comparison: Key Findings** ...] A --> B5[4. **Smart Contracts**: Investigating the use cases and applications of smart contracts.] B5 --> C5[**Key Findings: Smart Contracts Use Cases and Appl...] A --> B6[5. **Blockchain Interoperability**: Examining the challenges and solutions for interoperability between different blockchain networks.] B6 --> C6[**Key Findings: Blockchain Interoperability Challe...] A --> B7[6. **Blockchain Regulation**: Discussing the regulatory frameworks and challenges for blockchain adoption.] B7 --> C7[**Key Findings: Blockchain Regulation** The regul...] A --> B8[7. **Blockchain in Supply Chain Management**: Exploring the applications of blockchain in supply chain management.] B8 --> C8[**Key Findings: Blockchain in Supply Chain Managem...] A --> B9[8. **Blockchain in Healthcare**: Investigating the use cases and potential of blockchain in healthcare.] B9 --> C9[**Summary of Key Findings: Blockchain in Healthcar...] A --> B10[9. **Blockchain in Finance**: Analyzing the applications and implications of blockchain in finance.] B10 --> C10[**Key Findings: Blockchain in Finance** A systema...] A --> B11[10. **Decentralized Finance (DeFi)**: Examining the concept and applications of DeFi.] B11 --> C11[**Key Findings: Decentralized Finance (DeFi)** De...] A --> B12[11. **Blockchain Energy Consumption**: Investigating the environmental impact of blockchain networks.] B12 --> C12[**Key Findings: Blockchain Energy Consumption and ...] A --> B13[12. **Blockchain Identity Verification**: Exploring the use cases and solutions for identity verification on blockchain.] B13 --> C13[**Key Findings: Blockchain Identity Verification**...] A --> B14[13. **Blockchain Data Storage**: Discussing the solutions and challenges for data storage on blockchain.] B14 --> C14[**Key Findings: Blockchain Data Storage Solutions ...] A --> B15[14. **Blockchain Oracles**: Investigating the role and applications of oracles in blockchain.] B15 --> C15[**Key Findings: Blockchain Oracles** The study on...] A --> B16[15. **Blockchain Governance**: Examining the governance models and challenges for blockchain networks.] B16 --> C16[**Key Findings: Blockchain Governance Models and C...] A --> B17[**Cryptocurrency Research Subtopics (15)**] B17 --> C17[**Summary of Key Findings: Cryptocurrency Research...] A --> B18[16. **Bitcoin**: Analyzing the history, development, and impact of Bitcoin.] B18 --> C18[**Summary of Key Findings: The History, Developmen...] A --> B19[17. **Altcoins**: Investigating the characteristics and potential of alternative cryptocurrencies (altcoins).] B19 --> C19[**Key Findings: Characteristics and Potential of A...] A --> B20[18. **Cryptocurrency Market Analysis**: Examining the trends, patterns, and predictions of cryptocurrency markets.] B20 --> C20[**Key Findings: Cryptocurrency Market Analysis** ...] A --> B21[19. **Cryptocurrency Adoption**: Discussing the factors influencing cryptocurrency adoption.] B21 --> C21[**Key Findings: Factors Influencing Cryptocurrency...] A --> B22[20. **Cryptocurrency Regulation**: Investigating the regulatory frameworks and challenges for cryptocurrencies.] B22 --> C22[**Key Findings: Cryptocurrency Regulation** The r...] A --> B23[21. **Initial Coin Offerings (ICOs)**: Analyzing the concept, benefits, and risks of ICOs.] B23 --> C23[**Summary of Key Findings: Initial Coin Offerings ...] A --> B24[22. **Security Tokens**: Exploring the concept and applications of security tokens.] B24 --> C24[**Key Findings: Security Tokens** The concept of ...] A --> B25[23. **Cryptocurrency Wallets**: Discussing the types, security, and usability of cryptocurrency wallets.] B25 --> C25[**Key Findings: Cryptocurrency Wallets** **Types ...] A --> B26[24. **Cryptocurrency Exchanges**: Examining the types, security, and challenges of cryptocurrency exchanges.] B26 --> C26[**Key Findings: Cryptocurrency Exchanges** The re...] A --> B27[25. **Cryptocurrency Mining**: Investigating the process, benefits, and environmental impact of cryptocurrency mining.] B27 --> C27[**Key Findings: Cryptocurrency Mining** **Process...] A --> B28[26. **Cryptocurrency Trading**: Analyzing the strategies, risks, and challenges of cryptocurrency trading.] B28 --> C28[**Key Findings: Cryptocurrency Trading Strategies,...] A --> B29[27. **Cryptocurrency and Money Laundering**: Discussing the risks and challenges of cryptocurrency in money laundering.] B29 --> C29[**Key Findings: Cryptocurrency and Money Launderin...] A --> B30[28. **Cryptocurrency and Taxation**: Investigating the tax implications and challenges of cryptocurrency.] B30 --> C30[**Key Findings: Cryptocurrency and Taxation** The...] A --> B31[29. **Central Bank Digital Currencies (CBDCs)**: Examining the concept, benefits, and challenges of CBDCs.] B31 --> C31[**Key Findings: Central Bank Digital Currencies (C...] A --> B32[30. **Cryptocurrency and Financial Inclusion**: Discussing the potential of cryptocurrency to promote financial inclusion.] B32 --> C32[**Key Findings: Cryptocurrency and Financial Inclu...] A --> B33[These subtopics provide a comprehensive overview of the research areas in blockchain and cryptocurrency.] B33 --> C33[**Key Findings: Blockchain and Cryptocurrency Rese...] A -.-> D0[Gap: ## Blockchain and Cryptocurrency Research Topics] A -.-> D1[Gap: The provided text covers a wide range of research topics related to blockchain and cryptocurrency. Here are the key findings and missing areas:] A -.-> D2[Gap: ### Key Research Areas] A -.-> D3[Gap: 1. **Cryptocurrency Market Analysis**: Market uncertainty, complexity, and dynamic portfolios of cryptocurrency market contagion.] A -.-> D4[Gap: 2. **Security and Scams**: Decentralized peer-to-peer cryptocurrencies and crypto scams.] A -.-> D5[Gap: 3. **Blockchain Technology**: Potential applications of blockchain technology beyond cryptocurrency.] A -.-> D6[Gap: 4. **Regulation and Legality**: Legal standing of cryptocurrency in various global jurisdictions.] A -.-> D7[Gap: 5. **Consumer Behavior and Perception**: Factors influencing consumer satisfaction and perceptions of cryptocurrencies.] A -.-> D8[Gap: ### Research Gaps] A -.-> D9[Gap: 1. **Social Media Influence**: Investigating the role of social media in shaping cryptocurrency prices and market trends.] A -.-> D10[Gap: 2. **Blockchain-based Financial Inclusion**: Examining the potential of blockchain technology in promoting financial inclusion and accessibility.] A -.-> D11[Gap: 3. **Effective Regulatory Frameworks**: Developing effective regulatory frameworks for cryptocurrency transactions and markets.] A -.-> D12[Gap: ### Blockchain Research Subtopics] A -.-> D13[Gap: 1. **Blockchain Characteristics**: Understanding the fundamental nature of blockchain technology.] A -.-> D14[Gap: 2. **Cryptography**: Exploring the cryptographic techniques used in blockchain.] A -.-> D15[Gap: 3. **Smart Contracts**: Analyzing the applications and implications of smart contracts.] A -.-> D16[Gap: 4. **Consensus Algorithms**: Investigating the various consensus algorithms used in blockchain.] A -.-> D17[Gap: ### Cryptocurrency Research Subtopics] A -.-> D18[Gap: 1. **Bitcoin**: Analyzing the history, development, and impact of Bitcoin.] A -.-> D19[Gap: 2. **Altcoins**: Investigating the characteristics and potential of alternative cryptocurrencies (altcoins).] A -.-> D20[Gap: 3. **Cryptocurrency Market Analysis**: Examining the trends, patterns, and predictions of cryptocurrency markets.] A -.-> D21[Gap: ### Future Research Directions] A -.-> D22[Gap: 1. **Blockchain Scalability**: Exploring solutions to improve the scalability of blockchain networks.] A -.-> D23[Gap: 2. **Blockchain Security**: Analyzing the security threats and vulnerabilities of blockchain networks.] A -.-> D24[Gap: 3. **Consensus Algorithms**: Comparing and evaluating different consensus algorithms.] A -.-> D25[Gap: ### Conclusion] A -.-> D26[Gap: The research topics related to blockchain and cryptocurrency are diverse and extensive. The key findings highlight the importance of understanding the market, security, and regulatory aspects of blockchain and cryptocurrency. The missing areas and research gaps provide opportunities for future research and exploration.]")
  // const[mindMap,setMindMap] = useState("asasas")
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
      setMindMap(result.mind_map) // <-- Mermaid string from backend
    } catch (err) {
      setError("Something went wrong. Please try again.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 flex justify-center">
      <div className="w-full max-w-4xl space-y-6">

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
                <div className="bg-zinc-800 p-4 rounded-md">
                  <h3 className="text-white mb-2">Mind Map</h3>
                  {/* <MermaidChart chart={`
                    flowchart TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[fa:fa-car Car]
                    `} /> */}

                    <MermaidGraph
      graphCode={mindMap}
    />

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