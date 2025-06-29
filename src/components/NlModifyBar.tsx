"use client";

import { useState } from "react";

export function NLModifyBar({ originalData, onModified }: any) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  

  const runModification = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/nl-modify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, data: originalData }),
      });
      const { modifiedData } = await res.json();
    
      onModified(modifiedData);
      
    } catch {
      alert("AI modification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`
      fixed left-0 top-1/3
      flex flex-row-reverse items-stretch
      ${isExpanded ? 'w-96' : 'w-16'} h-64
      bg-yellow-50/90 backdrop-blur-sm border-r-2 border-yellow-200
      rounded-r-lg shadow-lg hover:shadow-xl z-10 transition-all duration-300
    `}>

      <div
        className="w-16 bg-yellow-100 hover:bg-yellow-200 flex items-center justify-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-bold text-sm transform -rotate-90 text-yellow-800 select-none">
          Modify
        </span>
      </div>


      <div className={`flex-1 p-4 ${isExpanded ? 'opacity-100 ml-0' : 'opacity-0 w-0 -ml-16'} transition-all overflow-y-auto`}>
        <h3 className="font-bold text-lg text-yellow-900 mb-3">✍ Modify Data</h3>
        <input
          className="border rounded px-3 py-2 w-full text-gray-600"
          placeholder="e.g. Set all durations to 2"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && runModification()}
        />
        <button
          onClick={runModification}
          disabled={loading || !prompt.trim()}
          className={`bg-yellow-600 text-white w-full py-2 mt-2 rounded ${loading ? 'opacity-75' : ''}`}
        >
          {loading ? "Applying..." : "Apply Change"}
        </button>
        <span className="text-xs text-yellow-600  ">Examples: <i>"Set Task "T1" duration to 2",</i> <br />Dont forget to put taks name within " "</span>
      </div>
    </div>
  );
}
