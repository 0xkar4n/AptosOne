// pages/index.tsx
'use client'
import { use, useState } from "react";
import axios from "axios";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const {account}=useWallet()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    try {
    const userWalletAddress=account?.address.toString()
      const response = await axios.post(`/api/testing`, { prompt,userWalletAddress });
      console.log("response in testing frontend",response.data)
      setResult(response.data.result);
    } catch (error: any) {
      setResult(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>LangChain Gemini Agent</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          className="bg-white text-black"
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          rows={4}
          
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Send Prompt"}
        </button>
      </form>
      {result && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Response:</h2>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}
