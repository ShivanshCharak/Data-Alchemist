"use client";
import { useState } from "react";
import { IRules,IClient,IWorker,ITask } from "@/types/sheets";

export function NaturalRuleInput({ onAIParsedRule,originalData }:{
  onAIParsedRule:(aiRule: IRules) => void,
  originalData:{ 
    clients: IClient[];
    workers: IWorker[];
    tasks: ITask[];
}

}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [rules,setRules] = useState([])
const parseRule = async () => {
  if (!originalData) {
    alert("Please upload data first");
    return;
  }

  setLoading(true);
  try {
    const res = await fetch("/api/nl-rule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userInput: query,
        contextData: { data: originalData },
      }),
    });

    const result = await res.json();
    const parsed = result.parsedRule;
    onAIParsedRule(parsed);
    setRules(parsed)
    setQuery("");
  } catch (err) {
    console.error("AI parsing error:", err);
    alert("AI parsing failed. Try again.");
  }
  setLoading(false);
};


  return (
    <div className={`
      fixed right-0 top-[420px] -translate-y-1/2
      flex items-stretch
      transition-all duration-300 ease-in-out
      ${isExpanded ? 'w-96' : 'w-16'}
      h-64
      bg-indigo-50/90 backdrop-blur-sm
      border-l-2 border-indigo-200
      rounded-l-lg overflow-hidden
      shadow-lg hover:shadow-xl
      z-20
    `}>
  
      <div 
        className="
          w-16 flex-shrink-0
          bg-indigo-100 hover:bg-indigo-200
          flex items-center justify-center
          cursor-pointer
          transition-colors duration-200
        "
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="
          font-bold text-xl
          transform -rotate-90
          whitespace-nowrap
          text-indigo-800
          select-none
        ">
          AI Rules
        </span>
      </div>

   
      <div className={`
        flex-1 p-4
        transition-opacity duration-200
        ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}
        overflow-y-auto
      `}>
        <div className="min-w-[300px] space-y-3">
          <h3 className="
            font-bold text-lg
            text-indigo-900
            mb-3 pb-2
            border-b border-indigo-200
          ">
             Natural Language to Rule
          </h3>
          
          <input
            type="text"
            className="border px-2 py-1 w-full rounded text-gray-600"
            placeholder="e.g. Make T1 and T2 co-run"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && parseRule()}
          />
          
          <button
            onClick={parseRule}
            disabled={loading || !query.trim()}
            className={`
              bg-indigo-600 text-white px-4 py-1 rounded w-full
              hover:bg-indigo-700 transition-colors
              ${loading ? 'opacity-75' : ''}
              ${!query.trim() ? 'cursor-not-allowed opacity-50' : ''}
            `}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-pulse">🔮</span> Parsing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                 Parse Rule
              </span>
            )}
          </button>
          
          <div className="text-xs text-indigo-700 italic mt-2">
            Try: "Tasks 1 and 2 should co-run" or "Limit group A to 3 slots"
          </div>
          {rules.length>0&&(
            <div className="bg-white max-h-56 overflow-y-auto rounded border p-2 text-sm">
              <h4 className="text-teal-800 font-semibold mb-1">Preview {rules.length} item</h4>
              <pre className="text-gray-500 whitespace-pre-wrap break-words text-xs">
                {JSON.stringify(rules,null)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}