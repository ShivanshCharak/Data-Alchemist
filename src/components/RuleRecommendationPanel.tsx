
"use client";

import { useState } from "react";
import { RuleJson,IClient,IWorker,ITask } from "@/types/sheets";
export function RuleRecommendationPanel({ allData}:{allData:{
  clients: IClient[];
  workers: IWorker[];
  tasks: ITask[];
}
}) {
  const [loading, setLoading] = useState(false);
  const [suggestedRules, setSuggestedRules] = useState<RuleJson[]>([]);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/rule-hints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(allData),
      });
      const { rules } = await res.json();
      setSuggestedRules(rules);
    } catch {
      alert("Failed to fetch rule suggestions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 border border-blue-200 bg-blue-50 p-4 rounded shadow">
      <h3 className="font-bold text-lg text-blue-900 mb-2">🔍 AI Rule Suggestions</h3>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={fetchSuggestions}
        disabled={loading}
      >
        {loading ? "Thinking..." : "Suggest Rules"}
      </button>

      {suggestedRules.length > 0 && (
        <div className="mt-4 text-sm">
          <h4 className="font-semibold text-blue-800">Suggestions:</h4>
          <ul className="list-disc pl-5 space-y-1 wrap-break-word">
            {suggestedRules.map((r, i) => (
              <li key={i} className="bg-white rounded p-2 border text-blue-800">
                <code>{JSON.stringify(r)}</code>
              </li> 
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
